import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import {
  AppImprovementUserDto,
  ChangePasswordDto,
  CreateUserDto,
  LoginDto,
  NotificationDto,
  ProfileUpdateDto,
  SignupPhoneDto,
  ValidateUserFieldDto,
  VerifyOtpDTO,
  VerifyPhoneDto,
} from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import { fileUploadCB } from '@/utils/global';

class AuthRoute implements Routes {
  public path = '/';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}verify-phone`, validationMiddleware(VerifyPhoneDto, 'body'), this.authController.verifyPhoneNumber);
    this.router.post(`${this.path}verify-otp`, validationMiddleware(VerifyOtpDTO, 'body'), this.authController.verifyOTP);
    this.router.post(`${this.path}forgot-password`, validationMiddleware(VerifyPhoneDto, 'body'), this.authController.forgotPassword);
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
      `${this.path}notification`,
      validationMiddleware(NotificationDto, 'body'),
      authMiddleware,
      this.authController.notificationUpdate,
    );
    this.router.post(`${this.path}logout`, authMiddleware, this.authController.logOut);

    // SECTION: General APIS => START
    this.router.get(`${this.path}app-improvement-types`, this.authController.appImprovementTypes);
    this.router.post(
      `${this.path}app-improvement-types-user`,
      validationMiddleware(AppImprovementUserDto, 'body'),
      authMiddleware,
      this.authController.updateUserAppImprovementSuggestion,
    );

    // !SECTION: General APIS => END
  }
}

export default AuthRoute;
