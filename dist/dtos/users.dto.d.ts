import { PaginationDto } from './general.dto';
export declare class VerifyPhoneDto {
    phone_country_code: string;
    phone_number: string;
    is_testing: string;
}
export declare class VerifyOtpDTO extends VerifyPhoneDto {
    otp: string;
    is_reset_password: boolean;
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
    trading_exp: string;
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
export declare class ResetPasswordDto {
    id: string;
    password: string;
}
export declare class ProfileUpdateDto {
    email: string;
    username: string;
    fullname: string;
    birth_date: string;
    trading_exp: string;
    gender: string;
    bio: string;
    youtube_link: string;
    instagram_link: string;
    telegram_link: string;
    remove_photo: string;
}
export declare class NotificationDto {
    allow_notification: string;
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
export declare class FollowDto {
    following_id: string;
}
export declare class UserRateDto {
    rate: number;
    comment?: string;
}
export declare class UserListingDto extends PaginationDto {
    search: string;
}
export declare class UserListingRateDto extends PaginationDto {
    has_all_data?: string;
}
export declare class DeviceTokenLogoutDto {
    device_token?: string;
}
export declare class NotificationMarkReadDto {
    notification_ids: string[];
}
export declare class NotificationSubscriptionDto {
    is_notify: boolean;
    subscribe_to_id: string;
}
