/// <reference types="multer" />
/// <reference types="mongoose" />
import { ChangePasswordDto, CreateUserDto, LoginDto, NotificationDto, ProfileUpdateDto, SignupPhoneDto, ValidateUserFieldDto, VerifyOtpDTO, VerifyPhoneDto } from '../dtos/users.dto';
import { TokenData } from '../interfaces/auth.interface';
import { User } from '../interfaces/users.interface';
declare class AuthService {
    users: import("mongoose").Model<User & import("mongoose").Document<any, any, any>, {}, {}>;
    validateUserField(userData: ValidateUserFieldDto): Promise<void>;
    verifyPhoneNumber(reqData: VerifyPhoneDto): Promise<void>;
    verifyOtp(reqData: VerifyOtpDTO): Promise<void>;
    signUpPhoneVerify(userData: SignupPhoneDto): Promise<{
        user: Partial<User>;
    }>;
    signUpUserVerify(userData: CreateUserDto): Promise<{
        cookie: string;
        user: Partial<User>;
        token_data: TokenData;
    }>;
    login(userData: LoginDto): Promise<{
        cookie: string;
        user: Partial<User>;
        token_data: TokenData;
    }>;
    forgotPassword(reqData: VerifyPhoneDto): Promise<void>;
    changePassword(userData: ChangePasswordDto, id: string): Promise<void>;
    profile(id: String): Promise<{
        user: Partial<User>;
    }>;
    editProfile(userData: ProfileUpdateDto, file: Express.Multer.File, id: string): Promise<void>;
    notificationUpdate(userData: NotificationDto, id: string): Promise<void>;
    logout(userData: User): Promise<void>;
    createToken(user: User): TokenData;
    createCookie(tokenData: TokenData): string;
}
export default AuthService;
