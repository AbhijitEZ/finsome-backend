export interface OtpValidationInf {
    _id: string;
    phone_country_code: string;
    phone_number: string;
    otp: string;
    confirmed: boolean;
    created_at: Date;
    updated_at: Date;
}
export interface AppImprovementInf {
    _id: string;
    name: string;
}
export interface QuickContactInf {
    _id: string;
    name: string;
    email: string;
    message: string;
}
export interface CountryInf {
    _id: string;
    name: string;
    image: string;
    emoji: string;
    code: string;
}
export interface StockTypeInf {
    _id: string;
    name: string;
    code: string;
    s_type: string;
    country_code?: string;
    image?: string;
}
export interface UserSuggestionImproveInf {
    description?: string;
    timestamp: string;
}
export interface PrivacyPolicyInf {
    _id: string;
    content: string;
}
export interface UserConfigurationInf {
    _id: string;
    user_id: string;
    stock_type: string;
    analysis_type: string;
    trade_type: string;
}
