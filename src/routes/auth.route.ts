import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
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
  UserRateDto,
  ValidateUserFieldDto,
  VerifyOtpDTO,
  VerifyPhoneDto,
} from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware, { authOptionalMiddleware } from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import { fileUploadCB } from '@/utils/global';
import { PaginationDto } from '@/dtos/general.dto';

class AuthRoute implements Routes {
  public path = '/';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}verify-phone`,
      validationMiddleware(VerifyPhoneDto, 'body'),
      authOptionalMiddleware,
      this.authController.verifyPhoneNumberWithOTP,
    );
    this.router.post(`${this.path}verify-otp`, validationMiddleware(VerifyOtpDTO, 'body'), this.authController.verifyOTP);
    this.router.post(`${this.path}forgot-password`, validationMiddleware(VerifyPhoneDto, 'body'), this.authController.forgotPassword);
    this.router.post(`${this.path}reset-password`, validationMiddleware(ResetPasswordDto, 'body'), this.authController.resetPassword);
    this.router.post(`${this.path}validate-user-field`, validationMiddleware(ValidateUserFieldDto, 'body'), this.authController.validateUserField);
    this.router.post(`${this.path}signup-phone-verify`, validationMiddleware(SignupPhoneDto, 'body'), this.authController.signUpPhoneVerify);
    this.router.post(`${this.path}signup-user-verify`, validationMiddleware(CreateUserDto, 'body'), this.authController.signUpUserVerify);
    this.router.post(`${this.path}login`, validationMiddleware(LoginDto, 'body'), this.authController.logIn);
    this.router.post(
      `${this.path}change-password`,
      validationMiddleware(ChangePasswordDto, 'body'),
      authMiddleware,
      this.authController.changePassword,
    );
    this.router.get(`${this.path}profile`, authMiddleware, this.authController.profile);
    this.router.post(
      `${this.path}profile`,
      fileUploadCB,
      validationMiddleware(ProfileUpdateDto, 'body'),
      authMiddleware,
      this.authController.editProfile,
    );
    this.router.post(
      `${this.path}change-phone-number`,
      validationMiddleware(VerifyOtpDTO, 'body'),
      authMiddleware,
      this.authController.changePhoneNumber,
    );
    this.router.post(
      `${this.path}notification`,
      validationMiddleware(NotificationDto, 'body'),
      authMiddleware,
      this.authController.notificationUpdate,
    );
    this.router.post(`${this.path}logout`, authMiddleware, this.authController.logOut);

    // SECTION: General APIS => START
    this.router.get(`${this.path}app-improvement-types`, this.authController.appImprovementTypes);
    this.router.get(`${this.path}app-improvement-types-user`, authMiddleware, this.authController.getUserAppImprovementSuggestion);
    this.router.post(
      `${this.path}app-improvement-types-user`,
      validationMiddleware(AppImprovementUserDto, 'body'),
      authMiddleware,
      this.authController.updateUserAppImprovementSuggestion,
    );
    this.router.post(`${this.path}quick-contact`, validationMiddleware(QuickContactDto, 'body'), authMiddleware, this.authController.addQuickContact);

    this.router.post(`${this.path}follow`, validationMiddleware(FollowDto, 'body'), authMiddleware, this.authController.followerRequest);
    this.router.get(`${this.path}follow-accept/:followId`, authMiddleware, this.authController.followAcceptByUser);
    this.router.delete(`${this.path}follow/:followId`, authMiddleware, this.authController.followDeleteRequest);

    this.router.get(`${this.path}users-list`, validationMiddleware(UserListingDto, 'query'), authMiddleware, this.authController.userListing);
    this.router.get(`${this.path}user-detail/:id`, authMiddleware, this.authController.userDetail);

    this.router.get(
      `${this.path}user/notifications`,
      authMiddleware,
      validationMiddleware(PaginationDto, 'query'),
      this.authController.userNotifications,
    );

    this.router.post(`${this.path}user/rate/:userId`, validationMiddleware(UserRateDto, 'body'), authMiddleware, this.authController.userRating);
    this.router.get(`${this.path}user/rate`, validationMiddleware(PaginationDto, 'query'), authMiddleware, this.authController.userListingRate);

    // !SECTION: General APIS => END
  }
}

export default AuthRoute;
