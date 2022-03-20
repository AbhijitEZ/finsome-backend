import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '../interfaces/auth.interface';
import AuthService from '../services/auth.service';
declare class AuthController {
    authService: AuthService;
    validateUserField: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    verifyPhoneNumber: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    verifyOTP: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    signUpPhoneVerify: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    signUpUserVerify: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    logIn: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    forgotPassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    changePassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    profile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    editProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    notificationUpdate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    logOut: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<void>;
}
export default AuthController;
