export const APP_SUCCESS_MESSAGE = {
  signup_phone_verify_success: 'Signup phone verified successfully.',
  signup_success: 'Signup successfully.',
  login_success: 'Login successfully.',
  logout_success: 'Logout successfully.',
  change_password_success: 'Password updated successfully.',
  phone_change_success: 'Phone number changed successfully.',
  delete_user_success: 'Deleted user successfully.',
  csv_upload_success: 'CSV upload for stocks successfully.',
  notification_update_success: 'Notification settings updated successfully.',
  update_profile_success: 'Profile updated successfully.',
  validate_user_field_success: 'No user exists with following field.',
  user_suggestion_app_improve_success: 'Thanks for giving the suggestion regarding app improvement.',
  sent_otp_success: 'OTP sent to you phone number.',
  password_reset_success: 'Password Reset successfully.',
  verify_otp_success: 'OTP is verified.',
  assets_image_success: 'Assests has been uploaded successfully.',
};

export const APP_ERROR_MESSAGE = {
  invalid_token: 'Invalid token, please login agian.',
  id_not_exists: 'Id is required, please add correct id.',
  post_like_exists: 'Post already has the like.',
  post_not_like_exists: 'Post doesn"t have the like.',
  delete_s3_error: 'Error while deleting the image from S3.',
  add_s3_error: 'Error while adding the image from S3.',
  post_complain_usr_complain_exists: 'Post or User id should exists at least one.',
  user_field_exists: 'User with the following field already exists, try something other.',
  user_id_not_exits: "User id doesn't exists in system.",
  user_not_auth: "User doesn't have authorization for this specific action.",
  user_not_complete_register: 'User has not completed the registration process, process further to complete.',
  user_already_register: 'User is already registered in system, please login to access.',
  email_exists: 'Email already exists use something different.',
  username_exists: 'Username already exists use something different.',
  phone_exists: 'Phone number is already exists please use another mobile number.',
  forbidden_error: 'Forbidden to access this resource for particular user.',
  user_blocked: 'Your account has been deactivated, please contact `contact@finsom.in` to activate your account.',
  post_not_exists: 'The post doesn"t exist.',
  otp_invalid: 'Invalid OTP, try different one.',
  phone_invalid: 'Invalid phonenumber, try different one.',
  user_not_exists: "User doesn't exists for the following phone number.",
  user_not_exists_id: "User doesn't exists for the following id.",
  stock_type_invalid: 'Invalid stock type.',
  stock_type_code_exists: 'Stock with following code already exists.',
  country_code_required: 'Country code is required for equity type share',
  privacy_not_exists: "Privacy Policy doesn't exists.",
  terms_not_exists: "Terms doesn't exists.",
  error_with_twilio: 'Error with Twillio need to debug further.',
  error_with_textlocal: 'Error with Text Local need to debug further.',
  incorrect_password: 'It is wrong password please enter correct password.',
  incorrect_img_format: 'Incorrect image format, use valid one.',
  incorrect_csv_format: 'Incorrect CSV format, use valid one.',
  incorrect_format: 'Incorrect format, use valid one.',
};

export const USER_ROLE = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
};

export const GENDER_CONST = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
};

export const STOCK_TYPE_CONST = {
  CRYPT: 'CRYPT',
  EQUITY: 'EQUITY',
  OTHER: 'OTHER',
};

export const ANALYSIS_TYPE_CONST = {
  FUNCTIONAL: 'FUNCTIONAL',
  TECHNICAL: 'TECHNICAL',
};

export const TRADE_TYPE_CONST = {
  INTRADAY: 'INTRADAY',
  SWING: 'SWING',
  POSITIONAL: 'POSITIONAL',
  LONG: 'LONG',
};

export const STOCK_RECOMMENDED_CONST = {
  SHORT: 'SHORT',
  LONG: 'LONG',
};

export const ACCOUNT_TYPE_CONST = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
};

export const ASSET_TYPE_CONST = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
};

export const COMPLAINT_TYPE = {
  POST: 'POST',
  USER: 'USER',
};

export const SKIP_DEF = '0';
export const LIMIT_DEF = '10';

export const FILE_LIMIT = 20000000;
export const FILE_COUNT_POST = 10;

export const APP_IMPROVEMENT_TYPES = 'app-improvement-types';
export const USER_CONFIGURATIONS = 'user-configurations';
export const QUICK_CONTACTS = 'quick-contacts';
export const COUNTRIES = 'countries';
export const POST_STOCKS = 'post-stocks';
export const LIKES = 'likes';
export const COMPLAINTS = 'complaints';
export const STOCK_TYPES = 'stock-types';
export const COMMENTS = 'comments';
export const PRIVACY_POLICIES = 'privacy-policies';
export const TERMS_CONDITIONS = 'terms-conditions';
export const OTP_VALIDATIONS = 'otp-validations';
export const USERS = 'users';
export const POSTS = 'posts';
export const USER_SUGGESTION_IMPROVEMENTS = 'user-suggestion-improvements';

export const profileImageFolder = 'profile-img/';
export const postAssetsFolder = 'post/';

export const DEFAULT_TIMEZONE = 'Asia/Kolkata';
