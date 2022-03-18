import { NextFunction, Request, Response } from 'express';
import { ChangePasswordDto, CreateUserDto, LoginDto, SignupPhoneDto, ValidateUserFieldDto, VerifyOtpDTO, VerifyPhoneDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';
import { APP_ERROR_MESSAGE, APP_SUCCESS_MESSAGE } from '@/utils/constants';
import { responseJSONMapper } from '@/utils/global';
import { HttpException } from '@/exceptions/HttpException';

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

  public verifyPhoneNumber = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqPayload: VerifyPhoneDto = req.body;
      await this.authService.verifyPhoneNumber(reqPayload);

      // TODO: OTP phase would be dynamic after the client confirmation
      responseJSONMapper(res, 200, { ...reqPayload, otp: 9999 }, APP_SUCCESS_MESSAGE.sent_otp_success);
    } catch (error) {
      next(error);
    }
  };

  public verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqPayload: VerifyOtpDTO = req.body;
      await this.authService.verifyOtp(reqPayload);

      // TODO: OTP phase would be dynamic after the client confirmation
      responseJSONMapper(res, 200, {}, APP_SUCCESS_MESSAGE.verify_otp_success);
    } catch (error) {
      next(error);
    }
  };

  public signUpPhoneVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: SignupPhoneDto = req.body;
      // TODO: Would have actual OTP check after client confirmation
      if (userData.otp !== 9999) {
        throw new HttpException(400, APP_ERROR_MESSAGE.otp_invalid);
      }
      delete userData.otp;
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

  // TODO: Profile Image upload pending
  public editProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      await this.authService.editProfile(req.body, req.file, req.user._id);

      responseJSONMapper(res, 200, {}, APP_SUCCESS_MESSAGE.update_profile_success);
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      await this.authService.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: {}, message: APP_SUCCESS_MESSAGE.logout_success });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
