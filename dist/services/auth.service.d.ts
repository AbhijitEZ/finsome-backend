/// <reference types="multer" />
/// <reference types="mongoose" />
import { AppImprovementUserDto, ChangePasswordDto, CreateUserDto, LoginDto, NotificationDto, ProfileUpdateDto, QuickContactDto, SignupPhoneDto, ValidateUserFieldDto, VerifyOtpDTO, VerifyPhoneDto } from '../dtos/users.dto';
import { TokenData } from '../interfaces/auth.interface';
import { User } from '../interfaces/users.interface';
declare class AuthService {
    users: import("mongoose").Model<User & import("mongoose").Document<any, any, any>, {}, {}>;
    otpValidation: import("mongoose").Model<import("../interfaces/general.interface").OtpValidationInf & import("mongoose").Document<any, any, any>, {}, {}>;
    quickContact: import("mongoose").Model<import("../interfaces/general.interface").QuickContactInf & import("mongoose").Document<any, any, any>, {}, {}>;
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
    appImprovementTypes(): Promise<any>;
    updateUserAppImprovementSuggestion(reqData: AppImprovementUserDto, id: string): Promise<any>;
    addQuickContact(reqData: QuickContactDto): Promise<any>;
    createToken(user: User): TokenData;
    createCookie(tokenData: TokenData): string;
}
export default AuthService;
