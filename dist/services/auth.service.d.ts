/// <reference types="multer" />
/// <reference types="mongoose" />
import { AppImprovementUserDto, ChangePasswordDto, CreateUserDto, FollowDto, LoginDto, NotificationDto, ProfileUpdateDto, QuickContactDto, ResetPasswordDto, SignupPhoneDto, UserListingDto, ValidateUserFieldDto, VerifyOtpDTO, VerifyPhoneDto } from '../dtos/users.dto';
import { TokenData } from '../interfaces/auth.interface';
import { User } from '../interfaces/users.interface';
declare class AuthService {
    users: import("mongoose").Model<User & import("mongoose").Document<any, any, any>, {}, {}>;
    otpValidation: import("mongoose").Model<import("../interfaces/general.interface").OtpValidationInf & import("mongoose").Document<any, any, any>, {}, {}>;
    appImprovement: import("mongoose").Model<import("../interfaces/general.interface").AppImprovementInf & import("mongoose").Document<any, any, any>, {}, {}>;
    quickContact: import("mongoose").Model<import("../interfaces/general.interface").QuickContactInf & import("mongoose").Document<any, any, any>, {}, {}>;
    userAppSuggestion: import("mongoose").Model<import("../interfaces/general.interface").UserSuggestionImproveInf & import("mongoose").Document<any, any, any>, {}, {}>;
    userFollowerM: import("mongoose").Model<import("../interfaces/general.interface").UserFollowerInf & import("mongoose").Document<any, any, any>, {}, {}>;
    validateUserField(userData: ValidateUserFieldDto): Promise<void>;
    verifyPhoneNumberWithOTP(reqData: VerifyPhoneDto, userData?: User): Promise<void>;
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
    verifyOtp(reqData: VerifyOtpDTO): Promise<any>;
    resetPassword(reqData: ResetPasswordDto): Promise<void>;
    changePassword(userData: ChangePasswordDto, id: string): Promise<void>;
    profile(id: String): Promise<{
        user: Partial<User>;
    }>;
    editProfile(userData: ProfileUpdateDto, file: Express.Multer.File, id: string): Promise<any>;
    changePhoneNumber(userData: VerifyOtpDTO, id: string): Promise<any>;
    notificationUpdate(userData: NotificationDto, id: string): Promise<any>;
    logout(userData: User): Promise<void>;
    appImprovementTypes(): Promise<any>;
    getUserAppImprovementSuggestion(id: string): Promise<any>;
    updateUserAppImprovementSuggestion(reqData: AppImprovementUserDto, id: string): Promise<any>;
    addQuickContact(reqData: QuickContactDto): Promise<any>;
    followerRequest(userId: string, reqData: FollowDto): Promise<any>;
    followAcceptRequest(userId: string, followId: string): Promise<any>;
    followDeleteRequest(userId: string, followId: string): Promise<any>;
    userListing(userId: string, reqData: UserListingDto): Promise<any>;
    userDetail(userId: string, detailId: string): Promise<any>;
    createToken(user: User): TokenData;
    createCookie(tokenData: TokenData): string;
    updateUserCodeWithSMS: (reqData: VerifyPhoneDto, existCode?: string, type?: string) => Promise<void>;
    private asyncUserCreationProcess;
}
export default AuthService;
