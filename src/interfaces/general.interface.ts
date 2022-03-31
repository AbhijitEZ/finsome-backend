export interface OtpValidationInf {
  _id: string;
  phone_country_code: string;
  phone_number: string;
  otp: string;
  confirmed: boolean;
  created_at: Date;
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

export interface UserSuggestionImproveInf {
  description?: string;
  timestamp: string;
}

export interface PrivacyPolicyInf {
  _id: string;
  content: string;
}
