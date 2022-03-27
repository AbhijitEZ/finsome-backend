export declare class VerifyPhoneDto {
    phone_country_code: string;
    phone_number: string;
    is_testing: boolean;
}
export declare class VerifyOtpDTO extends VerifyPhoneDto {
    otp: number;
}
export declare class ValidateUserFieldDto {
    field: string;
    value: string;
}
export declare class SignupPhoneDto extends VerifyOtpDTO {
    password: string;
}
export declare class CreateUserDto {
    id: string;
    email: string;
    username: string;
    fullname: string;
    birth_date: string;
    trading_exp: number;
    gender: string;
}
export declare class LoginDto {
    phone_number: string;
    password: string;
}
export declare class ChangePasswordDto {
    password: string;
    new_password: string;
}
export declare class ProfileUpdateDto {
    email: string;
    username: string;
    fullname: string;
    birth_date: string;
    trading_exp: number;
    gender: string;
    bio: string;
    youtube_link: string;
    instagram_link: string;
    telegram_link: string;
}
export declare class NotificationDto {
    allow_notification: boolean;
}
export declare class AppImprovementUserDto {
    id: string;
    description: string;
}
export declare class QuickContactDto {
    name: string;
    email: string;
    message: string;
}
