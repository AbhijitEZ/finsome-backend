export interface OtpValidationInf {
    _id: string;
    phone_country_code: string;
    phone_number: string;
    otp: string;
    confirmed: boolean;
    created_at: Date;
}
