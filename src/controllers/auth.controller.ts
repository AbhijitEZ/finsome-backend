import { NextFunction, Request, Response } from 'express';
import {
  ChangePasswordDto,
  CreateUserDto,
  LoginDto,
  NotificationDto,
  ResetPasswordDto,
  SignupPhoneDto,
  UserRateDto,
  ValidateUserFieldDto,
  VerifyOtpDTO,
  VerifyPhoneDto,
} from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';
import { APP_SUCCESS_MESSAGE } from '@/utils/constants';
import { responseJSONMapper } from '@/utils/global';

class AuthController {
  public authService = new AuthService();

  public validateUserField = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqPayload: ValidateUserFieldDto = req.body;
      await this.authService.validateUserField(reqPayload);

      responseJSONMapper(res, 200, {}, APP_SUCCESS_MESSAGE.validate_user_field_success);
    } catch (error) {
      next(error);
    }
  };

  public verifyPhoneNumberWithOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqPayload: VerifyPhoneDto = req.body;
      await this.authService.verifyPhoneNumberWithOTP(reqPayload, req.user);

      // TODO: OTP phase would be dynamic after the client confirmation
      responseJSONMapper(res, 200, { ...reqPayload, otp: 9999 }, APP_SUCCESS_MESSAGE.sent_otp_success);
    } catch (error) {
      next(error);
    }
  };

  public verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqPayload: VerifyOtpDTO = req.body;
      const id = await this.authService.verifyOtp(reqPayload);

      // TODO: OTP phase would be dynamic after the client confirmation
      responseJSONMapper(res, 200, { id }, APP_SUCCESS_MESSAGE.verify_otp_success);
    } catch (error) {
      next(error);
    }
  };

  public signUpPhoneVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: SignupPhoneDto = req.body;
      const { user } = await this.authService.signUpPhoneVerify(userData);

      responseJSONMapper(res, 201, { user }, APP_SUCCESS_MESSAGE.signup_phone_verify_success);
    } catch (error) {
      next(error);
    }
  };

  public signUpUserVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const { cookie, token_data, user } = await this.authService.signUpUserVerify(userData);
      res.setHeader('Set-Cookie', [cookie]);

      responseJSONMapper(res, 201, { token_data, user }, APP_SUCCESS_MESSAGE.signup_success);
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: LoginDto = req.body;
      const { cookie, token_data, user } = await this.authService.login(userData);
      res.setHeader('Set-Cookie', [cookie]);

      responseJSONMapper(res, 200, { token_data, user }, APP_SUCCESS_MESSAGE.login_success);
    } catch (error) {
      next(error);
    }
  };

  public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqPayload: VerifyPhoneDto = req.body;

      await this.authService.forgotPassword(reqPayload);

      // TODO: OTP phase would be dynamic after the client confirmation
      responseJSONMapper(res, 200, { ...reqPayload, otp: 9999 }, APP_SUCCESS_MESSAGE.sent_otp_success);
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqPayload: ResetPasswordDto = req.body;
      await this.authService.resetPassword(reqPayload);

      // TODO: OTP phase would be dynamic after the client confirmation
      responseJSONMapper(res, 200, {}, APP_SUCCESS_MESSAGE.password_reset_success);
    } catch (error) {
      next(error);
    }
  };

  public changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: ChangePasswordDto = req.body;
      // @ts-ignore
      await this.authService.changePassword(userData, req.user._id);

      responseJSONMapper(res, 200, {}, APP_SUCCESS_MESSAGE.change_password_success);
    } catch (error) {
      next(error);
    }
  };

  public profile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const user = await this.authService.profile(req.user._id);

      responseJSONMapper(res, 200, { ...user }, APP_SUCCESS_MESSAGE.update_profile_success);
    } catch (error) {
      next(error);
    }
  };

  public editProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const user = await this.authService.editProfile(req.body, req.file, req.user._id);

      responseJSONMapper(res, 200, { ...user }, APP_SUCCESS_MESSAGE.update_profile_success);
    } catch (error) {
      next(error);
    }
  };

  public changePhoneNumber = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: VerifyOtpDTO = req.body;

      // @ts-ignore
      const user = await this.authService.changePhoneNumber(userData, req.user._id);

      responseJSONMapper(res, 200, { ...user }, APP_SUCCESS_MESSAGE.phone_change_success);
    } catch (error) {
      next(error);
    }
  };

  public notificationUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: NotificationDto = req.body;

      // @ts-ignore
      const data = await this.authService.notificationUpdate(userData, req.user._id);

      responseJSONMapper(res, 200, data, APP_SUCCESS_MESSAGE.notification_update_success);
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      await this.authService.logout(userData, req.body);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: {}, message: APP_SUCCESS_MESSAGE.logout_success });
    } catch (error) {
      next(error);
    }
  };

  public deviceTokenAdd = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      await this.authService.deviceTokenAdd(userData, req.body);

      res.status(201).json({ data: {}, message: '' });
    } catch (error) {
      next(error);
    }
  };

  public appImprovementTypes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.authService.appImprovementTypes();

      responseJSONMapper(res, 200, data);
    } catch (error) {
      next(error);
    }
  };

  public getUserAppImprovementSuggestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.authService.getUserAppImprovementSuggestion(req.user._id);

      responseJSONMapper(res, 200, [...data.app_improvement_suggestion]);
    } catch (error) {
      next(error);
    }
  };

  public updateUserAppImprovementSuggestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.updateUserAppImprovementSuggestion(req.body, req.user._id);

      responseJSONMapper(res, 200, {}, APP_SUCCESS_MESSAGE.user_suggestion_app_improve_success);
    } catch (error) {
      next(error);
    }
  };

  public addQuickContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.authService.addQuickContact(req.body);

      responseJSONMapper(res, 201, data);
    } catch (error) {
      next(error);
    }
  };

  public followerRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.authService.followerRequest(req.user?._id, req.user?.fullname, req?.user?.profile_photo, req.body);

      responseJSONMapper(res, 201, data);
    } catch (error) {
      next(error);
    }
  };

  public followAcceptByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.authService.followAcceptRequest(req.user?._id, req.user?.fullname, req.user?.profile_photo, req.params?.followId);

      responseJSONMapper(res, 201, data);
    } catch (error) {
      next(error);
    }
  };

  public userListing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const data = await this.authService.userListing(req.user?._id, req.query);

      responseJSONMapper(res, 200, data);
    } catch (error) {
      next(error);
    }
  };

  public userNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const data = await this.authService.userNotfication(req.user?._id, req.query);

      responseJSONMapper(res, 200, data);
    } catch (error) {
      next(error);
    }
  };

  public userUnReadNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const data = await this.authService.userUnReadNotfication(req.user?._id);

      responseJSONMapper(res, 200, data);
    } catch (error) {
      next(error);
    }
  };

  public subscriptionToggleNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const data = await this.authService.subscriptionToggleNotification(req.user?._id, req.body);

      responseJSONMapper(res, 200, data);
    } catch (error) {
      next(error);
    }
  };

  public userMarkNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const data = await this.authService.userMarkNotfication(req.user?._id, req.body);

      responseJSONMapper(res, 200, data);
    } catch (error) {
      next(error);
    }
  };

  public userDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const data = await this.authService.userDetail(req.user?._id, req.params.id);

      responseJSONMapper(res, 200, data);
    } catch (error) {
      next(error);
    }
  };

  public followDeleteRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const data = await this.authService.followDeleteRequest(req.user?._id, req.params.followId);

      responseJSONMapper(res, 200, data);
    } catch (error) {
      next(error);
    }
  };

  public followerListing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const data = await this.authService.followerListing(req.user?._id, req.params.followId, req.query);

      responseJSONMapper(res, 200, data);
    } catch (error) {
      next(error);
    }
  };

  public followingListing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const data = await this.authService.followingListing(req.user?._id, req.params.followId, req.query);

      responseJSONMapper(res, 200, data);
    } catch (error) {
      next(error);
    }
  };

  public userRating = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.authService.userRating(req.user?._id, req.params?.userId, req.body as UserRateDto);

      responseJSONMapper(res, 201, data);
    } catch (error) {
      next(error);
    }
  };

  public userListingRate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.authService.userListingRate(req.user?._id, req.query, req.params?.userId);

      responseJSONMapper(res, 201, data);
    } catch (error) {
      next(error);
    }
  };

  public userRateDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.authService.userRateDetails(req.user?._id, req.params?.userRateId);

      responseJSONMapper(res, 201, data);
    } catch (error) {
      next(error);
    }
  };

  public userRateRemove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.authService.userRateRemove(req.user?._id, req.params?.userRateId);

      responseJSONMapper(res, 201, data);
    } catch (error) {
      next(error);
    }
  };

  public userRatingStatistics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.authService.userRatingStatistics(req.params?.userId);

      responseJSONMapper(res, 200, data);
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
