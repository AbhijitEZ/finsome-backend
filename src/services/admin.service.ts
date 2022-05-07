import { AdminLoginDto, PrivacyPolicyDto, ToggleUserStatusDto } from '@/dtos/admin.dto';
import config from 'config';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { HttpException } from '@/exceptions/HttpException';
import { APP_ERROR_MESSAGE, STOCK_TYPE_CONST, USER_ROLE } from '@/utils/constants';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import appImprovementModel from '@models/app-improvement-type';
import { fileUnSyncFromLocalStroage, profileImageGenerator } from '@/utils/util';
import { toDate } from 'date-fns';
import quickContactModel from '@/models/quick-contact';
import userSuggestionImprovementModel from '@/models/user-suggestion-improvement';
import privacyPolicyModel from '@/models/privacy-policy';
import termsConditionModel from '@/models/terms-condition';
import { StockUpdateTypeDto } from '@/dtos/posts.dto';
import stockTypeModel from '@/models/stock-types';
import fs from 'fs';
import { parse as csvParser } from 'csv-parse/sync';

class AdminService {
  public users = userModel;
  public appImprovement = appImprovementModel;
  public quickContact = quickContactModel;
  public userSuggestion = userSuggestionImprovementModel;
  public privacyPolicy = privacyPolicyModel;
  public termsConditionM = termsConditionModel;

  public async adminLogin(loginDto: AdminLoginDto): Promise<{ token: string }> {
    const adminUser: User = await this.users.findOne({
      email: loginDto.email,
      role: USER_ROLE.ADMIN,
    });

    if (!adminUser) {
      throw new HttpException(400, APP_ERROR_MESSAGE.user_not_exists_id);
    }

    const isPasswordMatching: boolean = await compare(loginDto.password, adminUser.password);
    if (!isPasswordMatching) throw new HttpException(409, APP_ERROR_MESSAGE.incorrect_password);

    const dataStoredInToken = { _id: adminUser._id, role: adminUser.role };
    const secretKey: string = config.get('secretKey');
    const expiresIn: number = config.get('tokenExpiry');
    const token = sign(dataStoredInToken, secretKey, { expiresIn });

    return { token };
  }

  public async userListing(user: User): Promise<Record<string, any>> {
    const users = await this.users
      .find({
        _id: { $ne: user._id },
        role: { $ne: USER_ROLE.ADMIN },
      })
      .sort({ created_at: -1 })
      .select(['-password', '-updated_at', '-term_agree_timestamp'])
      .lean();

    const userSanitized = users.map(user => ({ ...user, profile_photo: profileImageGenerator(user.profile_photo) }));

    return userSanitized;
  }

  public async dashboardData(user: User): Promise<Record<string, any>> {
    const users = await this.users
      .find({
        _id: { $ne: user._id },
        role: { $ne: USER_ROLE.ADMIN },
      })
      .sort({ created_at: -1 })
      .lean();

    const appImproves = await this.appImprovement.find({});
    const quickContacts = await this.quickContact.find({});
    const suggestions = await this.userSuggestion.find({});

    let active_user = 0,
      inactive_user = 0,
      total_user = 0,
      completed_registered_user = 0;

    users.map(usr => {
      total_user = total_user + 1;
      if (usr.deleted_at) {
        inactive_user = inactive_user + 1;
      }
      if (!usr.deleted_at) {
        active_user = active_user + 1;
      }
      if (usr.is_registration_complete) {
        completed_registered_user = completed_registered_user + 1;
      }
    });

    return {
      active_user,
      inactive_user,
      total_user,
      completed_registered_user,
      app_improves: appImproves.length,
      quick_contacts: quickContacts.length,
      suggestions: suggestions.length,
    };
  }

  public async toggleUserStatus(user: ToggleUserStatusDto): Promise<void> {
    const findUser = await this.users.findOne({ _id: user.id }).lean();

    if (!findUser) throw new HttpException(409, APP_ERROR_MESSAGE.user_not_exists_id);

    await this.users.findByIdAndUpdate(user.id, { deleted_at: user.status ? toDate(new Date()) : null }, { new: true });
  }

  public async deleteUser(id: string): Promise<void> {
    const findUser = await this.users.findOne({ _id: id }).lean();

    if (!findUser) throw new HttpException(409, APP_ERROR_MESSAGE.user_not_exists_id);

    // ANCHOR This would be added on, when more models gets associated with Users.
    await this.userSuggestion.findOneAndDelete({ user_id: id }).exec();
    await this.users.findOneAndDelete({ _id: id }).exec();
  }

  public async privacyPolicyListing(): Promise<any> {
    const findData = await this.privacyPolicy.findOne({}).lean();
    if (!findData) {
      throw new HttpException(409, APP_ERROR_MESSAGE.privacy_not_exists);
    }

    return findData;
  }

  public async privacyPolicyUpdate(data: PrivacyPolicyDto): Promise<void> {
    const findData = await this.privacyPolicy.findOne({}).lean();
    if (!findData) {
      await this.privacyPolicy.create({ ...data });
      return;
    }

    await this.privacyPolicy.findByIdAndUpdate(findData._id, { ...data });
  }

  public async termsConditionListing(): Promise<any> {
    const findData = await this.termsConditionM.findOne({}).lean();
    if (!findData) {
      throw new HttpException(409, APP_ERROR_MESSAGE.terms_not_exists);
    }

    return findData;
  }

  public async termsConditionUpdate(data: PrivacyPolicyDto): Promise<void> {
    const findData = await this.termsConditionM.findOne({}).lean();
    if (!findData) {
      await this.termsConditionM.create({ ...data });
      return;
    }

    await this.termsConditionM.findByIdAndUpdate(findData._id, { ...data });
  }

  public async appImprovementSuggestion(): Promise<any> {
    let allSuggestion = await this.userSuggestion
      .find({})
      .populate('user_id', ['fullname', 'phone_number'])
      .sort({ timestamp: -1 })
      .populate('app_improve_type_id', ['_id', 'name']);

    // @ts-ignore
    allSuggestion = allSuggestion.map((suggestion: any) => {
      return {
        _id: suggestion.id,
        phone_number: suggestion?.user_id?.phone_number ?? '',
        fullname: suggestion?.user_id?.fullname ?? '',
        app_improvement_suggestion: {
          id: suggestion?.app_improve_type_id?._id,
          description: suggestion.description ?? '',
          timestamp: suggestion.timestamp,
          name: suggestion?.app_improve_type_id?.name ?? '',
        },
      };
    });

    return allSuggestion;
  }

  public async quickContactListing(): Promise<Record<string, any>> {
    const quickContacts = await this.quickContact.find({}).sort({ created_at: -1 }).lean();

    return quickContacts;
  }

  public async stockTypeAdd(type: string, reqData: StockUpdateTypeDto): Promise<any> {
    if (!Object.keys(STOCK_TYPE_CONST).includes(type)) {
      throw new HttpException(404, APP_ERROR_MESSAGE.stock_type_invalid);
    }

    if (type === STOCK_TYPE_CONST.EQUITY && !reqData.country_code) {
      throw new HttpException(400, APP_ERROR_MESSAGE.country_code_required);
    }

    const stockExists = await stockTypeModel.findOne({ code: reqData.code });

    if (stockExists) {
      throw new HttpException(409, APP_ERROR_MESSAGE.stock_type_code_exists);
    }

    const stockNewData = await stockTypeModel.create({
      s_type: type,
      code: reqData.code,
      name: reqData.name,
      country_code: reqData.country_code || undefined,
      image: reqData.image || undefined,
    });

    // @ts-ignore
    return stockNewData._doc;
  }

  public async stockTypeDelete(type: string, _id: string): Promise<any> {
    if (!Object.keys(STOCK_TYPE_CONST).includes(type)) {
      throw new HttpException(404, APP_ERROR_MESSAGE.stock_type_invalid);
    }

    // ANCHOR This would be added on, when more models gets associated with Stock.
    await stockTypeModel.findOneAndDelete({ _id, s_type: type }).exec();
  }

  public async stockTypeUpload(type: string, path: string): Promise<any> {
    if (!Object.keys(STOCK_TYPE_CONST).includes(type)) {
      throw new HttpException(404, APP_ERROR_MESSAGE.stock_type_invalid);
    }

    const fileContent = await fs.readFileSync(path);

    const csvRecords = csvParser(fileContent, { columns: true });

    const finalRecords = [];

    await Promise.all(
      csvRecords.map(async (rec: any) => {
        const stockExists = await stockTypeModel.findOne({ code: rec.code });
        if (type === STOCK_TYPE_CONST.EQUITY && !rec.country_code) {
          throw new HttpException(400, APP_ERROR_MESSAGE.country_code_required);
        }

        if (stockExists) {
          throw new HttpException(409, APP_ERROR_MESSAGE.stock_type_code_exists);
        }

        if (!rec.image) {
          delete rec.image;
        }

        finalRecords.push({ ...rec, s_type: type });
      }),
    );

    await stockTypeModel.insertMany(finalRecords);

    fileUnSyncFromLocalStroage(path);
  }
}

export default AdminService;
