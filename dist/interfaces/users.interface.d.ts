export interface User {
    _id: string;
    email: string;
    password: string;
    role: string;
    term_agree_timestamp: string;
    updated_at: Date;
    is_registration_complete: boolean;
    profile_photo?: string;
    otp?: string;
    deleted_at?: Date;
}
export interface DeviceTokenInf {
    _id: string;
    user_id: string;
    device_token: string;
    platform: string;
    revoked: boolean;
    created_at: Date;
    updated_at: Date;
}
