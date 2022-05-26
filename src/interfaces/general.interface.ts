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

export interface PostsInf {
  user_id: string;
  stock_type: string;
  analysis_type?: string;
  trade_type?: string;
  stock_recommended_type?: string;
  post_images?: Array<string>;
  post_vids?: Array<string>;
  post_thumbs?: Array<string>;
  deleted_at?: Date;
  created_at_tz?: string;
}

export interface PrivacyPolicyInf {
  _id: string;
  content: string;
}

export interface PostStocksInf {
  _id: string;
  post_id: string;
  stock_id: string;
  deleted_at?: string;
}

export interface LikesInf {
  _id: string;
  post_id: string;
  user_id: string;
  deleted_at?: string;
}

export interface ComplaintsInf {
  _id: string;
  post_complain_id: string | null;
  user_complain_id?: string | null;
  user_id: string;
  reason?: string;
  description?: string;
  deleted_at?: string;
}

export interface CommentsInf {
  _id: string;
  post_id: string;
  user_id: string;
  message: string;
  parent_id: null | string;
  created_at: string;
  deleted_at?: string;
  reply?: Array<CommentsInf>;
  created_at_tz?: string;
}

export interface UserConfigurationInf {
  _id: string;
  user_id: string;
  stock_type: string;
  analysis_type: string;
  trade_type: string;
  account_type: string;
}
