export const APP_SUCCESS_MESSAGE = {
  signup_phone_verify_success: 'Signup phone verified successfully.',
  signup_success: 'Signup successfully.',
  login_success: 'Login successfully.',
  logout_success: 'Logout successfully.',
  change_password_success: 'Password updated successfully.',
  notification_update_success: 'Notification settings updated successfully.',
  update_profile_success: 'Profile updated successfully.',
  validate_user_field_success: 'No user exists with following field.',
  user_suggestion_app_improve_success: 'Thanks for giving the suggestion regarding app improvement.',
  sent_otp_success: 'OTP sent to you phone number.',
  password_reset_success: 'Password Reset successfully.',
  verify_otp_success: 'OTP is verified.',
};

export const APP_ERROR_MESSAGE = {
  invalid_token: 'Invalid token, please login agian.',
  delete_s3_error: 'Error while deleting the image from S3.',
  add_s3_error: 'Error while adding the image from S3.',
  user_field_exists: 'User with the following field already exists, try something other.',
  user_id_not_exits: "User id doesn't exists in system.",
  user_not_complete_register: 'User has not completed the registration process, process further to complete.',
  user_already_register: 'User is already registered in system, please login to access.',
  email_exists: 'Email already exists use something different.',
  username_exists: 'Username already exists use something different.',
  phone_exists: 'Phone number already exists use something different.',
  forbidden_error: 'Forbidden to access this resource for particular user.',
  user_blocked: 'User has been blocked by admin, contact admin to unblock.',
  otp_invalid: 'Invalid OTP, try different one.',
  phone_invalid: 'Invalid phonenumber, try different one.',
  user_not_exists: "User doesn't exists for the following phone number.",
  privacy_not_exists: "Privacy Policy doesn't exists.",
  error_with_twilio: 'Error with Twillio need to debug further.',
  error_with_textlocal: 'Error with Text Local need to debug further.',
  incorrect_password: 'Incorrect Password.',
  incorrect_img_format: 'Incorrect image format, use valid one.',
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

export const FILE_LIMIT = 20000000;

export const APP_IMPROVEMENT_TYPES = 'app-improvement-types';
export const QUICK_CONTACTS = 'quick-contacts';
export const PRIVACY_POLICIES = 'privacy-policies';
export const OTP_VALIDATIONS = 'otp-validations';
export const USERS = 'users';
export const USER_SUGGESTION_IMPROVEMENTS = 'user-suggestion-improvements';

export const profileImageFolder = 'profile-img/';
