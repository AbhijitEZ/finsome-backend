import { hash, compare } from 'bcrypt';
import config from 'config';
import { sign } from 'jsonwebtoken';
import { toDate } from 'date-fns';
import awsHandler from '@utils/aws';
import {
  AppImprovementUserDto,
  ChangePasswordDto,
  CreateUserDto,
  DeviceTokenLogoutDto,
  FollowDto,
  LoginDto,
  NotificationDto,
  NotificationMarkReadDto,
  NotificationSubscriptionDto,
  ProfileUpdateDto,
  QuickContactDto,
  ResetPasswordDto,
  SignupPhoneDto,
  UserListingDto,
  UserListingRateDto,
  UserRateDto,
  ValidateUserFieldDto,
  VerifyOtpDTO,
  VerifyPhoneDto,
} from '@dtos/users.dto';
import { connection, Types } from 'mongoose';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import firecustom from '@utils/firecustom';
import userModel from '@models/users.model';
import otpValidationModel from '@models/otp-validation.model';
import quickContactModel from '@models/quick-contact';
import userSuggestionImprovementModel from '@/models/user-suggestion-improvement';
import { includeDeletedAtMatch, isEmpty, listingResponseSanitize, profileImageGenerator } from '@utils/util';
import {
  ACCOUNT_TYPE_CONST,
  APP_ERROR_MESSAGE,
  APP_IMPROVEMENT_TYPES,
  DEFAULT_TIMEZONE,
  LIMIT_DEF,
  NOTIFICATION_SUBSCRIPTION,
  NOTIFICATION_TYPE_CONST,
  POSTS,
  SKIP_DEF,
  USERS,
  USER_CONFIGURATIONS,
  USER_FOLLOWERS,
  USER_RATES,
  USER_ROLE,
} from '@/utils/constants';
import { userResponseFilter } from '@/utils/global';
import { checkPhoneNumberCountryCodeForSMSCalling, createPhoneCodeToVerify, intervalDurationOTPCheck } from '@/utils/phone';
import { logger } from '@/utils/logger';
import appImprovementModel from '@/models/app-improvement-type';
import userConfigurationModel from '@/models/user-configurations';
import userFollowerModel from '@/models/user-followers';
import notificationModel from '@/models/notifications';
import { PaginationDto } from '@/dtos/general.dto';
import userRatesModel from '@/models/user-rates';
import deviceTokenModel from '@/models/device-tokens';
import notificationSubscriptionModel from '@/models/notification.subscription';

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
      //TODO: Would be uncommented in future
      checkPhoneNumberCountryCodeForSMSCalling({
        countryCode: reqData.phone_country_code,
        phoneNumber: reqData.phone_number,
        codeData: { code },
      });

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
    // if (!userPhoneCheck && userData.otp !== '9999') {
    //   throw new HttpException(400, APP_ERROR_MESSAGE.otp_invalid);
    // }

    // TODO: Would be removed in future for testing part.
    // if (userPhoneCheck && userData.otp !== '9999' && userData.otp !== userPhoneCheck.otp) {
    //   throw new HttpException(400, APP_ERROR_MESSAGE.otp_invalid);
    // }

    if(userData.otp != userPhoneCheck?.otp){
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

    this.updateUserCodeWithSMS(reqData, userFound.otp, 'user');
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

  public async logout(userData: User, reqData: DeviceTokenLogoutDto): Promise<void> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ email: userData.email, password: userData.password });
    if (!findUser) throw new HttpException(409, `You're email ${userData.email} not found`);

    /* Revoking the device token for the logout users */
    if (reqData.device_token) {
      deviceTokenModel.findOneAndUpdate(
        {
          device_token: reqData.device_token,
        },
        {
          revoked: true,
        },
      );
    }
  }
  public async deviceTokenAdd(userData: User, reqData: DeviceTokenLogoutDto): Promise<void> {
    const tokenExists = await deviceTokenModel.findOne({
      user_id: userData._id,
      device_token: reqData.device_token,
    });

    if (tokenExists) {
      throw new HttpException(409, 'Same token cannot be added');
    }

    deviceTokenModel.create({
      user_id: userData._id,
      device_token: reqData.device_token,
    });
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

  public async userNotfication(userId: string, queryData: PaginationDto): Promise<any> {
    const notificationsData = await notificationModel.aggregate([
      {
        $match: {
          user_id: userId,
          deleted_at: {
            $eq: null,
          },
        },
      },
      {
        $addFields: {
          created_at_tz: { $dateToString: { date: '$created_at', timezone: DEFAULT_TIMEZONE, format: '%Y-%m-%dT%H:%M:%S.%LZ' } },
        },
      },
      {
        $sort: {
          created_at: -1,
        },
      },
      {
        $facet: {
          totalRecords: [
            {
              $count: 'total',
            },
          ],
          result: [
            {
              $skip: parseInt(queryData.skip ?? SKIP_DEF),
            },
            {
              $limit: parseInt(queryData.limit ?? LIMIT_DEF),
            },
          ],
        },
      },
    ]);

    const data = listingResponseSanitize(notificationsData);

    // @ts-ignore
    return data;
  }

  public async userUnReadNotfication(userId: string): Promise<any> {
    const notifyqb = notificationModel.find({
      user_id: userId,
      is_read: false,
    });

    const count = await notifyqb.count();

    // @ts-ignore
    return count;
  }

  public async subscriptionToggleNotification(userId: string, reqData: NotificationSubscriptionDto): Promise<any> {
    if (!reqData.is_notify) {
      await notificationSubscriptionModel.findOneAndDelete({
        subscriber_id: userId,
        user_id: reqData.subscribe_to_id,
      });
    } else {
      const existingSubscription = await notificationSubscriptionModel.findOne({
        subscriber_id: userId,
        user_id: reqData.subscribe_to_id,
      });

      if (existingSubscription) {
        throw new HttpException(400, APP_ERROR_MESSAGE.follower_exists);
      }

      await notificationSubscriptionModel.create({
        subscriber_id: userId,
        user_id: reqData.subscribe_to_id,
      });
    }

    // @ts-ignore
    return {};
  }

  public async userMarkNotfication(userId: string, queryData: NotificationMarkReadDto): Promise<any> {
    await Promise.all(
      queryData.notification_ids?.map(async id => {
        await notificationModel.findByIdAndUpdate(id, {
          is_read: true,
        });
      }),
    );

    // @ts-ignore
    return {};
  }

  public async addQuickContact(reqData: QuickContactDto): Promise<any> {
    const newContact = await this.quickContact.create({ ...reqData });

    // @ts-ignore
    return newContact;
  }

  public async followerRequest(userId: string, fullname: string, profilePhoto: string, reqData: FollowDto): Promise<any> {
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

    const message =
      acceptedState === ACCOUNT_TYPE_CONST.PRIVATE
        ? `${fullname || 'User'} has requested to follow you`
        : `${fullname || 'User'} has started following you`;

    const metadata = {
      follow: newFollower._id,
      user_id: userId,
      profile_photo: profileImageGenerator(profilePhoto),
    };

    await notificationModel.create({
      user_id: reqData.following_id,
      message: message,
      meta_data: metadata,
    });

    this.sendNotificationWrapper(reqData.following_id, {
      notification: {
        title: message,
      },
      data: {
        payload: JSON.stringify({ ...metadata, type: NOTIFICATION_TYPE_CONST.FOLLOW }),
      },
    });

    // @ts-ignore
    return newFollower;
  }

  public async followAcceptRequest(userId: string, fullname: string, profilephoto: string, followId: string): Promise<any> {
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

    notificationModel.create({
      user_id: followReqExists?.follower_id,
      message: `${fullname || 'User'} has accepted your follow request`,
      type: NOTIFICATION_TYPE_CONST.FOLLOW_ACCEPT,
      meta_data: {
        follow: followId,
        user_id: userId,
        profile_photo: profileImageGenerator(profilephoto),
      },
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

  public async followerListing(userId: string, followId: string, reqData: PaginationDto): Promise<any> {
    const followerQb = await this.userFollowerM.aggregate([
      {
        $match: {
          user_id: new Types.ObjectId(followId),
          accepted: { $eq: true },
          deleted_at: { $eq: null },
        },
      },
      {
        $lookup: {
          from: USERS,
          localField: 'follower_id',
          foreignField: '_id',
          as: 'follower_detail',
          pipeline: [
            {
              $project: {
                fullname: 1,
                profile_photo: 1,
                username: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$follower_detail',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { created_at: -1 },
      },
      {
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
      },
    ]);

    const data = listingResponseSanitize(followerQb);
    return data;
  }

  public async followingListing(userId: string, followId: string, reqData: PaginationDto): Promise<any> {
    const followingQb = await this.userFollowerM.aggregate([
      {
        $match: {
          follower_id: new Types.ObjectId(followId),
          accepted: { $eq: true },
          deleted_at: { $eq: null },
        },
      },
      {
        $lookup: {
          from: USERS,
          localField: 'user_id',
          foreignField: '_id',
          as: 'following_detail',
          pipeline: [
            {
              $project: {
                fullname: 1,
                profile_photo: 1,
                username: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$following_detail',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { created_at: -1 },
      },
      {
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
      },
    ]);

    const data = listingResponseSanitize(followingQb);
    return data;
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
          is_registration_complete: true,
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
        $lookup: {
          from: USER_RATES,
          localField: '_id',
          foreignField: 'user_id',
          as: 'user_rates',
          pipeline: [
            {
              $group: {
                _id: '$user_id',
                avg: { $avg: '$rate' },
              },
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
          path: '$user_rates',
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
        $match: includeDeletedAtMatch({
          _id: {
            $eq: new Types.ObjectId(detailId),
          },
          role: { $eq: USER_ROLE.MEMBER },
        }),
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
          from: USER_CONFIGURATIONS,
          localField: '_id',
          foreignField: 'user_id',
          as: 'user_configuration',
          pipeline: [
            {
              $project: {
                account_type: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: POSTS,
          localField: '_id',
          foreignField: 'user_id',
          as: 'posts',
          pipeline: [
            {
              $match: includeDeletedAtMatch({}),
            },
            {
              $count: 'post_total_count',
            },
          ],
        },
      },
      /* TODO: Require check */
      {
        $lookup: {
          from: NOTIFICATION_SUBSCRIPTION,
          localField: '_id',
          foreignField: 'user_id',
          as: 'notification_subscription',
          pipeline: [
            {
              $match: {
                subscriber_id: {
                  $eq: new Types.ObjectId(userId),
                },
              },
            },
            {
              $project: { user_id: 1, subscriber_id: 1 },
            },
          ],
        },
      },
      {
        $lookup: {
          from: USER_FOLLOWERS,
          localField: '_id',
          foreignField: 'user_id',
          as: 'following',
          pipeline: [
            {
              $match: includeDeletedAtMatch({
                follower_id: new Types.ObjectId(userId),
                accepted: { $eq: true },
              }),
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
              $match: includeDeletedAtMatch({
                accepted: { $eq: true },
              }),
            },
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
              $match: includeDeletedAtMatch({
                user_id: new Types.ObjectId(userId),
              }),
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
              $match: includeDeletedAtMatch({
                accepted: { $eq: true },
              }),
            },
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
        $lookup: {
          from: USER_RATES,
          localField: '_id',
          foreignField: 'user_id',
          as: 'user_rates',
          pipeline: [
            {
              $group: {
                _id: '$user_id',
                avg: { $avg: '$rate' },
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$user_rates',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$user_configuration',
          preserveNullAndEmptyArrays: true,
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
      {
        $unwind: {
          path: '$notification_subscription',
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

  public async userRating(userId: string, userRateId: string, reqData: UserRateDto): Promise<any> {
    const userRateExists = await this.users.findOne({
      _id: userRateId,
    });

    if (!userRateExists) {
      throw new HttpException(400, APP_ERROR_MESSAGE.user_id_not_exits);
    }

    const userRatingExists = await userRatesModel.findOne({
      deleted_at: {
        $eq: null,
      },
      user_id: userRateId,
      rated_by_user: userId,
    });

    if (userRatingExists) {
      const currentUserRatingData = await userRatesModel.findByIdAndUpdate(
        userRatingExists._id,
        {
          rate: reqData.rate,
          comment: reqData.comment,
        },
        { new: true },
      );

      // @ts-ignore
      return currentUserRatingData._doc;
    }

    const newUserRateData = await userRatesModel.create({
      user_id: userRateId,
      rated_by_user: userId,
      rate: reqData.rate,
      comment: reqData.comment,
    });

    // @ts-ignore
    return newUserRateData._doc;
  }

  public async userListingRate(_: string, reqData: UserListingRateDto, userId): Promise<any> {
    let userRatings = userRatesModel.aggregate([
      {
        $match: {
          deleted_at: {
            $eq: null,
          },
          user_id: new Types.ObjectId(userId),
        },
      },
      {
        $addFields: {
          updated_at_tz: { $dateToString: { date: '$updated_at', timezone: DEFAULT_TIMEZONE, format: '%Y-%m-%dT%H:%M:%S.%LZ' } },
        },
      },
      {
        $lookup: {
          from: USERS,
          localField: 'rated_by_user',
          foreignField: '_id',
          as: 'user_detail',
          pipeline: [
            {
              $project: {
                fullname: 1,
                profile_photo: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: USER_RATES,
          localField: 'rated_by_user',
          foreignField: 'user_id',
          as: 'user_rates',
          pipeline: [
            {
              $group: {
                _id: '$user_id',
                avg: { $avg: '$rate' },
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$user_rates',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$user_detail',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { updated_at: -1 },
      },
      {
        $facet: {
          totalRecords: [
            {
              $count: 'total',
            },
          ],
          result: reqData.has_all_data
            ? []
            : [
                {
                  $skip: parseInt(reqData.skip ?? SKIP_DEF),
                },
                {
                  $limit: parseInt(reqData.limit ?? LIMIT_DEF),
                },
              ],
        },
      },
    ]);

    userRatings = await userRatings.exec();

    const data = listingResponseSanitize(userRatings);

    return data;
  }

  public async userListingRate2(_: string, reqData: any, userId): Promise<any> {
    let query: any = userRatesModel.aggregate([
      {
        $match: {
          deleted_at: {
            $eq: null,
          },
          user_id: new Types.ObjectId(userId),
        },
      },
      {
        $addFields: {
          updated_at_tz: { $dateToString: { date: '$updated_at', timezone: DEFAULT_TIMEZONE, format: '%Y-%m-%dT%H:%M:%S.%LZ' } },
        },
      },
      {
        $lookup: {
          from: USERS,
          localField: 'rated_by_user',
          foreignField: '_id',
          as: 'user_detail',
          pipeline: [
            {
              $project: {
                fullname: 1,
                profile_photo: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: USER_RATES,
          localField: 'rated_by_user',
          foreignField: 'user_id',
          as: 'user_rates',
          pipeline: [
            {
              $group: {
                _id: '$user_id',
                avg: { $avg: '$rate' },
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$user_rates',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$user_detail',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { updated_at: -1 },
      },
    ]);

    let model: any = userRatesModel;
    let data: any = await model.aggregatePaginate(query, { page: reqData.page, limit: reqData.limit });
    return data;
  }

  public async userRateDetails(userId: string, userRateId: string): Promise<any> {
    const userRateExists = await this.users.findOne({
      _id: userRateId,
    });

    if (!userRateExists) {
      throw new HttpException(400, APP_ERROR_MESSAGE.user_id_not_exits);
    }

    const userRatingExists = await userRatesModel.findOne({
      deleted_at: {
        $eq: null,
      },
      user_id: userRateId,
      rated_by_user: userId,
    });

    // @ts-ignore
    return userRatingExists._doc;
  }

  public async userRateRemove(userId: string, userRateId: string): Promise<any> {
    const userRateExists = await this.users.findOne({
      _id: userRateId,
    });

    if (!userRateExists) {
      throw new HttpException(400, APP_ERROR_MESSAGE.user_id_not_exits);
    }

    const userRatingExists = await userRatesModel.findOne({
      deleted_at: {
        $eq: null,
      },
      user_id: userRateId,
      rated_by_user: userId,
    });

    await userRatesModel.findByIdAndDelete(userRatingExists._id);

    // @ts-ignore
    return {};
  }

  // NOTE: find better optimal solution
  public async userRatingStatistics(userId: string): Promise<any> {
    const userRateAvg = await userRatesModel.aggregate([
      {
        $match: {
          user_id: new Types.ObjectId(userId),
          deleted_at: { $eq: null },
        },
      },
    ]);

    let overall_avg = 0;
    let no_rating_1 = 0;
    let no_rating_2 = 0;
    let no_rating_3 = 0;
    let no_rating_4 = 0;
    let no_rating_5 = 0;

    userRateAvg.forEach(userPerRate => {
      if (userPerRate.rate) {
        overall_avg += userPerRate.rate;
      }
      if (userPerRate?.rate < 2) {
        no_rating_1 += 1;
      }
      if (userPerRate?.rate >= 2 && userPerRate?.rate < 3) {
        no_rating_2 += 1;
      }
      if (userPerRate?.rate >= 3 && userPerRate?.rate < 4) {
        no_rating_3 += 1;
      }
      if (userPerRate?.rate >= 4 && userPerRate?.rate < 5) {
        no_rating_4 += 1;
      }
      if (userPerRate?.rate >= 5) {
        no_rating_5 += 1;
      }
    });

    const total_no_user_rating = userRateAvg.length;

    overall_avg = total_no_user_rating ? parseFloat((overall_avg / total_no_user_rating).toFixed(2)) : 0;

    return {
      overall_avg,
      no_rating_1,
      no_rating_2,
      no_rating_3,
      no_rating_4,
      no_rating_5,
      total_no_user_rating,
    };
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
    checkPhoneNumberCountryCodeForSMSCalling({
      countryCode: reqData.phone_country_code,
      phoneNumber: reqData.phone_number,
      codeData: { code },
    });

    if (type == 'user') {
      await this.users.findOneAndUpdate({ phone_number: reqData.phone_number, phone_country_code: reqData.phone_country_code }, { otp: code }, {new: true});
    }else{
      await this.otpValidation.findOneAndUpdate(
        { phone_number: reqData.phone_number, phone_country_code: reqData.phone_country_code },
        { otp: code },
      );
    }
  };

  private asyncUserCreationProcess = async (id: string) => {
    const configExists = await userConfigurationModel.findOne({ user_id: id });
    if (!configExists) {
      userConfigurationModel.create({ user_id: id, account_type: ACCOUNT_TYPE_CONST.PUBLIC });
    }
  };

  private sendNotificationWrapper = async (userId: string, messagePayload: any) => {
    const userData = await userModel.find({ _id: userId }).select('allow_notification').lean();
    if (userData.length > 0) {
      if (userData[0].allow_notification == true) {
        const deviceTokens = await deviceTokenModel.find({
          user_id: userId,
          revoked: false,
        });

        if (deviceTokens?.length) {
          deviceTokens.forEach(data => {
            firecustom.sendNotification(data.device_token, messagePayload);
          });
        }
      }
    }
  };
}

export default AuthService;
