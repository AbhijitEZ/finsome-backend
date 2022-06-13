import { hash, compare } from 'bcrypt';
import config from 'config';
import { sign } from 'jsonwebtoken';
import { toDate } from 'date-fns';
import awsHandler from '@utils/aws';
import {
  AppImprovementUserDto,
  ChangePasswordDto,
  CreateUserDto,
  FollowDto,
  LoginDto,
  NotificationDto,
  ProfileUpdateDto,
  QuickContactDto,
  ResetPasswordDto,
  SignupPhoneDto,
  UserListingDto,
  ValidateUserFieldDto,
  VerifyOtpDTO,
  VerifyPhoneDto,
} from '@dtos/users.dto';
import { connection, Types } from 'mongoose';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import otpValidationModel from '@models/otp-validation.model';
import quickContactModel from '@models/quick-contact';
import userSuggestionImprovementModel from '@/models/user-suggestion-improvement';
import { isEmpty, listingResponseSanitize, profileImageGenerator } from '@utils/util';
import {
  ACCOUNT_TYPE_CONST,
  APP_ERROR_MESSAGE,
  APP_IMPROVEMENT_TYPES,
  DEFAULT_TIMEZONE,
  LIMIT_DEF,
  SKIP_DEF,
  USER_FOLLOWERS,
  USER_ROLE,
} from '@/utils/constants';
import { userResponseFilter } from '@/utils/global';
import { createPhoneCodeToVerify, intervalDurationOTPCheck } from '@/utils/phone';
import { logger } from '@/utils/logger';
import appImprovementModel from '@/models/app-improvement-type';
import userConfigurationModel from '@/models/user-configurations';
import userFollowerModel from '@/models/user-followers';
import notificationModel from '@/models/notifications';

class AuthService {
  public users = userModel;
  public otpValidation = otpValidationModel;
  public appImprovement = appImprovementModel;
  public quickContact = quickContactModel;
  public userAppSuggestion = userSuggestionImprovementModel;
  public userFollowerM = userFollowerModel;

  public async validateUserField(userData: ValidateUserFieldDto): Promise<void> {
    const userFound = await this.users.findOne({ [userData.field]: userData.value });
    if (userFound) throw new HttpException(409, APP_ERROR_MESSAGE.user_field_exists);
  }

  public async verifyPhoneNumberWithOTP(reqData: VerifyPhoneDto, userData?: User): Promise<void> {
    const userFound = await this.users.findOne({ phone_number: reqData.phone_number });
    if (userFound) throw new HttpException(409, APP_ERROR_MESSAGE.phone_exists);

    // For Change Phone number require userData
    if (userData) {
      // BETA_CODE: For the developer testing we are adding this flag in order to save the sms exhaustion.
      if (reqData.is_testing === 'true') {
        return;
      }

      if (intervalDurationOTPCheck(userData.updated_at)) {
        this.updateUserCodeWithSMS(reqData, undefined, 'user');
      } else {
        this.updateUserCodeWithSMS(reqData, userData.otp, 'user');
      }

      return;
    } else {
      // BETA_CODE: For the developer testing we are adding this flag in order to save the sms exhaustion.
      if (reqData.is_testing === 'true') {
        return;
      }

      const phoneNumberExists = await this.otpValidation.findOne({
        phone_number: reqData.phone_number,
        phone_country_code: reqData.phone_country_code,
      });

      // TODO: update the sms sending logic
      if (phoneNumberExists) {
        console.log('EXSITING OTP VALIDAION');
        if (intervalDurationOTPCheck(phoneNumberExists.updated_at)) {
          this.updateUserCodeWithSMS(reqData);
        } else {
          this.updateUserCodeWithSMS(reqData, phoneNumberExists.otp);
        }
        return;
      }

      console.log('NEW OTP VALIDAION');

      const code = createPhoneCodeToVerify();
      logger.info(`Phone number OTP changed for first time: ${reqData.phone_country_code}-${reqData.phone_number}.`);
      // TODO: Would be uncommented in future
      // checkPhoneNumberCountryCodeForSMSCalling({
      //   countryCode: reqData.phone_country_code,
      //   phoneNumber: reqData.phone_number,
      //   codeData: { code },
      // });

      await this.otpValidation.create({
        phone_number: reqData.phone_number,
        phone_country_code: reqData.phone_country_code,
        otp: code,
      });
    }
  }

  public async signUpPhoneVerify(userData: SignupPhoneDto): Promise<{ user: Partial<User> }> {
    const userPhoneCheck = await this.otpValidation.findOne({
      phone_number: userData.phone_number,
      phone_country_code: userData.phone_country_code,
    });

    // TODO: Would be removed in future.
    if (!userPhoneCheck && userData.otp !== '9999') {
      throw new HttpException(400, APP_ERROR_MESSAGE.otp_invalid);
    }

    // TODO: Would be removed in future for testing part.
    if (userPhoneCheck && userData.otp !== '9999' && userData.otp !== userPhoneCheck.otp) {
      throw new HttpException(400, APP_ERROR_MESSAGE.otp_invalid);
    }

    const hashedPassword = await hash(userData.password, 10);
    const createUserData = await this.users.create({ ...userData, password: hashedPassword, term_agree_timestamp: toDate(new Date()) });

    // @ts-ignore
    const userResFilter = userResponseFilter(createUserData._doc);

    return { user: userResFilter };
  }

  public async signUpUserVerify(userData: CreateUserDto): Promise<{ cookie: string; user: Partial<User>; token_data: TokenData }> {
    const userAlreadyFullyRegistered = await this.users.findOne({ _id: userData.id, is_registration_complete: true });
    if (userAlreadyFullyRegistered) {
      throw new HttpException(400, APP_ERROR_MESSAGE.user_already_register);
    }

    const userExistsCheckForEmailField = await this.users.findOne({ email: userData.email });
    if (userExistsCheckForEmailField) {
      throw new HttpException(409, APP_ERROR_MESSAGE.email_exists);
    }

    const userExistsCheckForUsernameField = await this.users.findOne({ username: userData.username });
    if (userExistsCheckForUsernameField) {
      throw new HttpException(409, APP_ERROR_MESSAGE.username_exists);
    }

    const updateUserData = await this.users.findByIdAndUpdate(
      userData.id,
      {
        email: userData.email,
        username: userData.username,
        fullname: userData.fullname,
        birth_date: userData.birth_date,
        trading_exp: userData.trading_exp,
        gender: userData.gender,
        is_registration_complete: true,
      },
      { new: true },
    );

    if (!updateUserData) {
      throw new HttpException(400, APP_ERROR_MESSAGE.user_id_not_exits);
    }

    this.asyncUserCreationProcess(updateUserData._id);

    const token_data = this.createToken(updateUserData);
    const cookie = this.createCookie(token_data);

    // @ts-ignore
    const userResFilter = userResponseFilter(updateUserData._doc);

    return { cookie, token_data, user: userResFilter };
  }

  public async login(userData: LoginDto): Promise<{ cookie: string; user: Partial<User>; token_data: TokenData }> {
    const findUser = await this.users.findOne({ phone_number: userData.phone_number }).lean();
    if (!findUser) throw new HttpException(409, APP_ERROR_MESSAGE.user_not_exists);

    if (!findUser.is_registration_complete) {
      throw new HttpException(451, APP_ERROR_MESSAGE.user_not_complete_register, { id: findUser._id });
    }

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, APP_ERROR_MESSAGE.incorrect_password);

    /* IF User is admin we won't allow them to login in the mobile application */
    if (findUser.role === USER_ROLE.ADMIN) {
      throw new HttpException(403, APP_ERROR_MESSAGE.forbidden_error);
    }

    // @ts-ignore
    if (findUser.deleted_at) {
      throw new HttpException(400, APP_ERROR_MESSAGE.user_blocked);
    }

    this.asyncUserCreationProcess(findUser._id);

    const token_data = this.createToken(findUser);
    const cookie = this.createCookie(token_data);
    const userResFilter = userResponseFilter(findUser);

    return { cookie, token_data, user: userResFilter };
  }

  public async forgotPassword(reqData: VerifyPhoneDto): Promise<void> {
    const userFound = await this.users.findOne({ phone_number: reqData.phone_number, phone_country_code: reqData.phone_country_code });
    if (!userFound) throw new HttpException(409, APP_ERROR_MESSAGE.user_not_exists);

    // BETA_CODE: For the developer testing we are adding this flag in order to save the sms exhaustion.
    if (reqData.is_testing === 'true') {
      return;
    }

    if (intervalDurationOTPCheck(userFound.updated_at)) {
      this.updateUserCodeWithSMS(reqData, undefined, 'user');
    } else {
      this.updateUserCodeWithSMS(reqData, userFound.otp, 'user');
    }
  }

  public async verifyOtp(reqData: VerifyOtpDTO): Promise<any> {
    const userFound = await this.users.findOne({ phone_number: reqData.phone_number, phone_country_code: reqData.phone_country_code });
    if (!userFound) throw new HttpException(409, APP_ERROR_MESSAGE.user_not_exists);

    // TODO: Would be removed in production in future.
    if (reqData.otp !== '9999' && userFound.otp !== reqData.otp) {
      throw new HttpException(400, APP_ERROR_MESSAGE.otp_invalid);
    }

    return {
      id: userFound._id,
    };
  }

  public async resetPassword(reqData: ResetPasswordDto): Promise<void> {
    const userFound = await this.users.findOne({ _id: reqData.id });
    if (!userFound) throw new HttpException(409, APP_ERROR_MESSAGE.user_not_exists);

    const hashedPassword = await hash(reqData.password, 10);
    await this.users.findByIdAndUpdate(reqData.id, { password: hashedPassword }, { new: true });
  }

  public async changePassword(userData: ChangePasswordDto, id: string): Promise<void> {
    const findUser = await this.users.findOne({ _id: id }).lean();
    if (!findUser) throw new HttpException(409, APP_ERROR_MESSAGE.user_not_exists);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, APP_ERROR_MESSAGE.incorrect_password);

    const hashedPassword = await hash(userData.new_password, 10);
    await this.users.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
  }

  public async profile(id: String): Promise<{ user: Partial<User> }> {
    const findUser = await this.users.findOne({ _id: id }).lean();
    const userResFilter = userResponseFilter(findUser);
    return { user: userResFilter };
  }

  public async editProfile(userData: ProfileUpdateDto, file: Express.Multer.File, id: string): Promise<any> {
    const userExistsCheckForEmailField = await this.users.findOne({ _id: { $ne: id }, email: userData.email });
    if (userExistsCheckForEmailField) {
      throw new HttpException(409, APP_ERROR_MESSAGE.email_exists);
    }

    const userExistsCheckForUsernameField = await this.users.findOne({ _id: { $ne: id }, username: userData.username });
    if (userExistsCheckForUsernameField) {
      throw new HttpException(409, APP_ERROR_MESSAGE.username_exists);
    }

    const payload: any = {
      email: userData.email,
      username: userData.username,
      fullname: userData.fullname,
      birth_date: userData.birth_date,
      trading_exp: userData.trading_exp,
      gender: userData.gender,
      bio: userData.bio ?? null,
      youtube_link: userData.youtube_link,
      instagram_link: userData.instagram_link,
      telegram_link: userData.telegram_link,
    };

    const profileUser = await this.users.findOne({ _id: id });

    if (file) {
      // Delete the existing image from S3
      if (profileUser.profile_photo) {
        awsHandler.deleteProfileImage(profileUser.profile_photo);
      }

      // Add image
      const profileImage = await awsHandler.addAssets(file);
      payload.profile_photo = profileImage;
    }

    if (userData.remove_photo && profileUser?.profile_photo) {
      awsHandler.deleteProfileImage(profileUser.profile_photo);
      payload.profile_photo = null;
    }

    await this.users.findByIdAndUpdate(id, payload, { new: true });
    return await this.profile(id);
  }

  public async changePhoneNumber(userData: VerifyOtpDTO, id: string): Promise<any> {
    const findUser = await this.users.findOne({ _id: id }).lean();
    if (!findUser) throw new HttpException(409, APP_ERROR_MESSAGE.user_not_exists);

    // TODO: Would have actual OTP check after client confirmation
    if (userData.otp !== '9999' && userData.otp !== findUser.otp) {
      throw new HttpException(400, APP_ERROR_MESSAGE.otp_invalid);
    }

    await this.users.findByIdAndUpdate(id, { phone_country_code: userData.phone_country_code, phone_number: userData.phone_number }, { new: true });

    return await this.profile(id);
  }

  public async notificationUpdate(userData: NotificationDto, id: string): Promise<any> {
    const findUser = await this.users.findOne({ _id: id }).lean();
    if (!findUser) throw new HttpException(409, APP_ERROR_MESSAGE.user_not_exists);

    // TODO: Needs to be updated once mobile change are fixed
    await this.users.findByIdAndUpdate(id, { allow_notification: userData.allow_notification === 'true' }, { new: true });
    return await this.profile(id);
  }

  public async logout(userData: User): Promise<void> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ email: userData.email, password: userData.password });
    if (!findUser) throw new HttpException(409, `You're email ${userData.email} not found`);
  }

  public async appImprovementTypes(): Promise<any> {
    const result = await connection.collection(APP_IMPROVEMENT_TYPES).find({}).toArray();

    return [...result];
  }

  public async getUserAppImprovementSuggestion(id: string): Promise<any> {
    const appSuggestion = await this.userAppSuggestion.find({ user_id: id }).populate('app_improve_type_id').populate('user_id', ['_id', 'fullname']);

    return {
      // @ts-ignore
      app_improvement_suggestion: appSuggestion,
    };
  }

  public async updateUserAppImprovementSuggestion(reqData: AppImprovementUserDto, id: string): Promise<any> {
    await this.userAppSuggestion.create({ description: reqData?.description ?? '', user_id: id, app_improve_type_id: reqData.id });
  }

  public async userNotfication(userId: string): Promise<any> {
    const notificationsData = await notificationModel
      .find({
        user_id: userId,
        deleted_at: {
          $eq: null,
        },
      })
      .lean();

    // @ts-ignore
    return notificationsData;
  }
  public async addQuickContact(reqData: QuickContactDto): Promise<any> {
    const newContact = await this.quickContact.create({ ...reqData });

    // @ts-ignore
    return newContact;
  }

  public async followerRequest(userId: string, fullname: string, reqData: FollowDto): Promise<any> {
    const followerReqExists = await this.userFollowerM.findOne({
      user_id: reqData.following_id,
      follower_id: userId,
    });

    if (followerReqExists) {
      throw new HttpException(409, APP_ERROR_MESSAGE.follower_exists);
    }

    const followingUserDetail = await userConfigurationModel
      .findOne({
        user_id: reqData.following_id,
      })
      .lean();

    const acceptedState = followingUserDetail?.account_type === ACCOUNT_TYPE_CONST.PRIVATE ? ACCOUNT_TYPE_CONST.PRIVATE : ACCOUNT_TYPE_CONST.PUBLIC;

    const newFollower = await this.userFollowerM.create({
      follower_id: userId,
      user_id: reqData.following_id,
      accepted: followingUserDetail?.account_type === ACCOUNT_TYPE_CONST.PRIVATE ? false : true,
    });

    if (acceptedState === ACCOUNT_TYPE_CONST.PUBLIC) {
      notificationModel.create({
        user_id: reqData.following_id,
        message: `${fullname || 'User'} has requested to follow you`,
        meta_data: {
          _id: newFollower._id,
        },
      });
    }

    // @ts-ignore
    return newFollower;
  }

  public async followAcceptRequest(userId: string, followId: string): Promise<any> {
    const followReqExists = await this.userFollowerM.findOne({
      _id: followId,
      user_id: userId,
      accepted: false,
    });

    if (!followReqExists) {
      throw new HttpException(400, APP_ERROR_MESSAGE.follower_exists);
    }

    await this.userFollowerM.findByIdAndUpdate(followReqExists._id, {
      accepted: true,
    });

    return {
      accepted: true,
    };
  }

  public async followDeleteRequest(userId: string, followId: string): Promise<any> {
    const followReqExists = await this.userFollowerM.findOne({
      _id: followId,
    });

    if (!followReqExists) {
      throw new HttpException(400, APP_ERROR_MESSAGE.follower_exists);
    }

    await this.userFollowerM.findByIdAndDelete(followReqExists._id);

    return {
      accepted: false,
    };
  }

  public async userListing(userId: string, reqData: UserListingDto): Promise<any> {
    const usersqb = this.users.aggregate([
      {
        $match: {
          _id: {
            $ne: userId,
          },
          deleted_at: { $eq: null },
          role: { $eq: USER_ROLE.MEMBER },
        },
      },
      {
        $addFields: {
          created_at_tz: { $dateToString: { date: '$created_at', timezone: DEFAULT_TIMEZONE, format: '%Y-%m-%dT%H:%M:%S.%LZ' } },
        },
      },
      {
        $unset: ['password'],
      },
      {
        $lookup: {
          from: USER_FOLLOWERS,
          localField: '_id',
          foreignField: 'user_id',
          as: 'following',
          pipeline: [
            {
              $match: {
                follower_id: new Types.ObjectId(userId),
              },
            },
            {
              $unset: ['follower_id', 'user_id', 'created_at', 'updated_at', 'deleted_at'],
            },
          ],
        },
      },
      {
        $lookup: {
          from: USER_FOLLOWERS,
          localField: '_id',
          foreignField: 'follower_id',
          as: 'follower',
          pipeline: [
            {
              $match: {
                user_id: new Types.ObjectId(userId),
              },
            },
            {
              $unset: ['follower_id', 'user_id', 'created_at', 'updated_at', 'deleted_at'],
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$following',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$follower',
          preserveNullAndEmptyArrays: true,
        },
      },
      { $sort: { created_at: -1 } },
    ]);

    if (reqData.search) {
      usersqb.append({
        $match: {
          // TODO: to have email and username added in the search checking
          fullname: new RegExp(reqData.search, 'i'),
        },
      });
    }

    usersqb.append({
      $facet: {
        totalRecords: [
          {
            $count: 'total',
          },
        ],
        result: [
          {
            $skip: parseInt(reqData.skip ?? SKIP_DEF),
          },
          {
            $limit: parseInt(reqData.limit ?? LIMIT_DEF),
          },
        ],
      },
    });

    const usersData = await usersqb.exec();
    const { total_count, result } = listingResponseSanitize(usersData);
    return { total_count, users: result.map(user => ({ ...user, profile_photo: profileImageGenerator(user.profile_photo) })) };
  }

  public async userDetail(userId: string, detailId: string): Promise<any> {
    const usersqb = this.users.aggregate([
      {
        $match: {
          _id: {
            $eq: new Types.ObjectId(detailId),
          },
          deleted_at: { $eq: null },
          role: { $eq: USER_ROLE.MEMBER },
        },
      },
      {
        $addFields: {
          created_at_tz: { $dateToString: { date: '$created_at', timezone: DEFAULT_TIMEZONE, format: '%Y-%m-%dT%H:%M:%S.%LZ' } },
        },
      },
      {
        $unset: ['password'],
      },
      {
        $lookup: {
          from: USER_FOLLOWERS,
          localField: '_id',
          foreignField: 'user_id',
          as: 'following',
          pipeline: [
            {
              $match: {
                follower_id: new Types.ObjectId(userId),
              },
            },
            {
              $unset: ['follower_id', 'user_id', 'created_at', 'updated_at', 'deleted_at'],
            },
          ],
        },
      },
      {
        $lookup: {
          from: USER_FOLLOWERS,
          localField: '_id',
          foreignField: 'user_id',
          as: 'following_count',
          pipeline: [
            {
              $unset: ['follower_id', 'user_id', 'created_at', 'updated_at', 'deleted_at'],
            },
            {
              $count: 'total_following',
            },
          ],
        },
      },
      {
        $lookup: {
          from: USER_FOLLOWERS,
          localField: '_id',
          foreignField: 'follower_id',
          as: 'follower',
          pipeline: [
            {
              $match: {
                user_id: new Types.ObjectId(userId),
              },
            },
            {
              $unset: ['follower_id', 'user_id', 'created_at', 'updated_at', 'deleted_at'],
            },
          ],
        },
      },
      {
        $lookup: {
          from: USER_FOLLOWERS,
          localField: '_id',
          foreignField: 'follower_id',
          as: 'follower_count',
          pipeline: [
            {
              $unset: ['follower_id', 'user_id', 'created_at', 'updated_at', 'deleted_at'],
            },
            {
              $count: 'total_follower',
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$following',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$follower',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$following_count',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$follower_count',
          preserveNullAndEmptyArrays: true,
        },
      },
      { $sort: { created_at: -1 } },
    ]);

    usersqb.append({
      $facet: {
        totalRecords: [
          {
            $count: 'total',
          },
        ],
        result: [
          {
            $skip: 0,
          },
          {
            $limit: 1,
          },
        ],
      },
    });

    const usersData = await usersqb.exec();
    const { result } = listingResponseSanitize(usersData);
    return { user: result.map(user => ({ ...user, profile_photo: profileImageGenerator(user.profile_photo) }))?.[0] ?? {} };
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id, role: user.role };
    const secretKey: string = config.get('secretKey');
    const expiresIn: number = config.get('tokenExpiry');
    const token = sign(dataStoredInToken, secretKey, { expiresIn });

    return { expires_in: expiresIn, token };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expires_in};`;
  }

  public updateUserCodeWithSMS = async (reqData: VerifyPhoneDto, existCode?: string, type?: string) => {
    const code = existCode ? existCode : createPhoneCodeToVerify();
    logger.info(`Phone number OTP for: ${reqData.phone_country_code}-${reqData.phone_number}.`);
    // TODO: Would be uncommented in future
    // checkPhoneNumberCountryCodeForSMSCalling({
    //   countryCode: reqData.phone_country_code,
    //   phoneNumber: reqData.phone_number,
    //   codeData: { code },
    // });

    if (!type) {
      await this.otpValidation.findOneAndUpdate(
        { phone_number: reqData.phone_number, phone_country_code: reqData.phone_country_code },
        { otp: code },
      );
    } else if (type === 'user') {
      await this.users.findOneAndUpdate({ phone_number: reqData.phone_number, phone_country_code: reqData.phone_country_code }, { otp: code });
    }
  };

  private asyncUserCreationProcess = async (id: string) => {
    const configExists = await userConfigurationModel.findOne({ user_id: id });
    if (!configExists) {
      userConfigurationModel.create({ user_id: id, account_type: ACCOUNT_TYPE_CONST.PUBLIC });
    }
  };
}

export default AuthService;
