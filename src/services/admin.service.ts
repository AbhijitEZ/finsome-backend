import { AdminLoginDto, PrivacyPolicyDto, ToggleUserStatusDto } from '@/dtos/admin.dto';
import config from 'config';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { HttpException } from '@/exceptions/HttpException';
import { APP_ERROR_MESSAGE, USER_ROLE } from '@/utils/constants';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import appImprovementModel from '@models/app-improvement-type';
import { profileImageGenerator } from '@/utils/util';
import { toDate } from 'date-fns';
import quickContactModel from '@/models/quick-contact';
import userSuggestionImprovementModel from '@/models/user-suggestion-improvement';
import privacyPolicyModel from '@/models/privacy-policy';

class AdminService {
  public users = userModel;
  public appImprovement = appImprovementModel;
  public quickContact = quickContactModel;
  public userSuggestion = userSuggestionImprovementModel;
  public privacyPolicy = privacyPolicyModel;

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
      .select(['-password', '-updated_at', '-term_agree_timestamp'])
      .lean();

    const userSanitized = users.map(user => ({ ...user, profile_photo: profileImageGenerator(user.profile_photo) }));

    return userSanitized;
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
    await this.userSuggestion.findOneAndDelete({ user_id: id });
    await this.users.findOneAndDelete({ _id: id });
  }

  public async privacyPolicyListing(): Promise<any> {
    const findData = await this.privacyPolicy.findOne({}).lean();
    console.log(findData, 'findData');
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

  public async appImprovementSuggestion(): Promise<any> {
    let allSuggestion = await this.userSuggestion
      .find({})
      .populate('user_id', ['fullname', 'phone_number'])
      .populate('app_improve_type_id', ['_id', 'name']);
    console.log(allSuggestion, 'allSuggestion');

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
    const quickContacts = await this.quickContact.find({}).lean();

    return quickContacts;
  }
}

export default AdminService;
