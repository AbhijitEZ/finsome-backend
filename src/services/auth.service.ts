import { hash, compare } from 'bcrypt';
import config from 'config';
import { sign } from 'jsonwebtoken';
import { toDate, intervalToDuration } from 'date-fns';
import awsHandler from '@utils/aws';
import {
  AppImprovementUserDto,
  ChangePasswordDto,
  CreateUserDto,
  LoginDto,
  NotificationDto,
  ProfileUpdateDto,
  QuickContactDto,
  ResetPasswordDto,
  SignupPhoneDto,
  ValidateUserFieldDto,
  VerifyOtpDTO,
  VerifyPhoneDto,
} from '@dtos/users.dto';
import { connection } from 'mongoose';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import otpValidationModel from '@models/otp-validation.model';
import quickContactModel from '@models/quick-contact';
import { isEmpty } from '@utils/util';
import { APP_ERROR_MESSAGE, APP_IMPROVEMENT_TYPES, USER_ROLE } from '@/utils/constants';
import { userResponseFilter } from '@/utils/global';
import { createPhoneCodeToVerify } from '@/utils/phone';
import { logger } from '@/utils/logger';

class AuthService {
  public users = userModel;
  public otpValidation = otpValidationModel;
  public quickContact = quickContactModel;

  public async validateUserField(userData: ValidateUserFieldDto): Promise<void> {
    const userFound = await this.users.findOne({ [userData.field]: userData.value });
    if (userFound) throw new HttpException(409, APP_ERROR_MESSAGE.user_field_exists);
  }

  public async verifyPhoneNumber(reqData: VerifyPhoneDto): Promise<void> {
    const userFound = await this.users.findOne({ phone_number: reqData.phone_number });
    if (userFound) throw new HttpException(409, APP_ERROR_MESSAGE.phone_exists);
    // BETA_CODE: For the developer testing we are adding this flag in order to save the sms exhaustion.
    if (reqData.is_testing) {
      return;
    }
    const phoneNumberExists = await this.otpValidation.findOne({
      phone_number: reqData.phone_number,
      phone_country_code: reqData.phone_country_code,
    });

    // TODO: update the sms sending logic
    if (phoneNumberExists) {
      if (
        intervalToDuration({
          start: toDate(phoneNumberExists.created_at),
          end: toDate(new Date()),
        }).minutes > 10
      ) {
        logger.info(`Phone number OTP changed for: ${reqData.phone_country_code}-${reqData.phone_number}.`);
        await this.otpValidation.findOneAndUpdate(
          { phone_number: reqData.phone_number, phone_country_code: reqData.phone_country_code },
          { otp: createPhoneCodeToVerify() },
        );
      }
      return;
    }

    await this.otpValidation.create({
      phone_number: reqData.phone_number,
      phone_country_code: reqData.phone_country_code,
      otp: createPhoneCodeToVerify(),
    });
  }

  // TODO: This would require bypass verification for testing and Third party integration
  public async verifyOtp(reqData: VerifyOtpDTO): Promise<any> {
    const userFound = await this.users.findOne({ phone_number: reqData.phone_number, phone_country_code: reqData.phone_country_code });
    if (!userFound) throw new HttpException(409, APP_ERROR_MESSAGE.user_not_exists);
    if (reqData.otp !== '9999') {
      throw new HttpException(400, APP_ERROR_MESSAGE.otp_invalid);
    }

    return {
      id: userFound._id,
    };
  }

  public async signUpPhoneVerify(userData: SignupPhoneDto): Promise<{ user: Partial<User> }> {
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
      throw new HttpException(401, APP_ERROR_MESSAGE.user_blocked);
    }

    const token_data = this.createToken(findUser);
    const cookie = this.createCookie(token_data);
    const userResFilter = userResponseFilter(findUser);

    return { cookie, token_data, user: userResFilter };
  }

  public async forgotPassword(reqData: VerifyPhoneDto): Promise<void> {
    const userFound = await this.users.findOne({ phone_number: reqData.phone_number, phone_country_code: reqData.phone_country_code });
    if (!userFound) throw new HttpException(409, APP_ERROR_MESSAGE.user_not_exists);

    // BETA_CODE: For the developer testing we are adding this flag in order to save the sms exhaustion.
    if (reqData.is_testing) {
      return;
    }
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

  public async editProfile(userData: ProfileUpdateDto, file: Express.Multer.File, id: string): Promise<void> {
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
      bio: userData.bio,
      youtube_link: userData.youtube_link,
      instagram_link: userData.instagram_link,
      telegram_link: userData.telegram_link,
    };

    if (file) {
      const profileUser = await this.users.findOne({ _id: id });
      // Delete the existing image from S3
      if (profileUser.profile_photo) {
        awsHandler.deleteProfileImage(profileUser.profile_photo);
      }

      // Add image
      const profileImage = await awsHandler.addProfileImage(file);
      payload.profile_photo = profileImage;
    }

    await this.users.findByIdAndUpdate(id, payload, { new: true });
  }

  public async notificationUpdate(userData: NotificationDto, id: string): Promise<any> {
    const findUser = await this.users.findOne({ _id: id }).lean();
    if (!findUser) throw new HttpException(409, APP_ERROR_MESSAGE.user_not_exists);

    await this.users.findByIdAndUpdate(id, { allow_notification: userData.allow_notification }, { new: true });
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

  public async updateUserAppImprovementSuggestion(reqData: AppImprovementUserDto, id: string): Promise<any> {
    await this.users.findByIdAndUpdate(id, { app_improvement_suggestion: { ...reqData, timestamp: toDate(new Date()) } });

    return await this.profile(id);
  }

  public async addQuickContact(reqData: QuickContactDto): Promise<any> {
    const newContact = await this.quickContact.create({ ...reqData });

    // @ts-ignore
    return newContact;
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
}

export default AuthService;
