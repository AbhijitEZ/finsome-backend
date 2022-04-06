"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileImageFolder = exports.USER_SUGGESTION_IMPROVEMENTS = exports.USERS = exports.OTP_VALIDATIONS = exports.TERMS_CONDITIONS = exports.PRIVACY_POLICIES = exports.QUICK_CONTACTS = exports.APP_IMPROVEMENT_TYPES = exports.FILE_LIMIT = exports.GENDER_CONST = exports.USER_ROLE = exports.APP_ERROR_MESSAGE = exports.APP_SUCCESS_MESSAGE = void 0;
exports.APP_SUCCESS_MESSAGE = {
    signup_phone_verify_success: 'Signup phone verified successfully.',
    signup_success: 'Signup successfully.',
    login_success: 'Login successfully.',
    logout_success: 'Logout successfully.',
    change_password_success: 'Password updated successfully.',
    phone_change_success: 'Phone number changed successfully.',
    delete_user_success: 'Deleted user successfully.',
    notification_update_success: 'Notification settings updated successfully.',
    update_profile_success: 'Profile updated successfully.',
    validate_user_field_success: 'No user exists with following field.',
    user_suggestion_app_improve_success: 'Thanks for giving the suggestion regarding app improvement.',
    sent_otp_success: 'OTP sent to you phone number.',
    password_reset_success: 'Password Reset successfully.',
    verify_otp_success: 'OTP is verified.',
};
exports.APP_ERROR_MESSAGE = {
    invalid_token: 'Invalid token, please login agian.',
    id_not_exists: 'Id is required, please add correct id.',
    delete_s3_error: 'Error while deleting the image from S3.',
    add_s3_error: 'Error while adding the image from S3.',
    user_field_exists: 'User with the following field already exists, try something other.',
    user_id_not_exits: "User id doesn't exists in system.",
    user_not_complete_register: 'User has not completed the registration process, process further to complete.',
    user_already_register: 'User is already registered in system, please login to access.',
    email_exists: 'Email already exists use something different.',
    username_exists: 'Username already exists use something different.',
    phone_exists: 'Phone number is already exists please use another mobile number.',
    forbidden_error: 'Forbidden to access this resource for particular user.',
    user_blocked: 'User has been blocked by admin, contact admin to unblock.',
    otp_invalid: 'Invalid OTP, try different one.',
    phone_invalid: 'Invalid phonenumber, try different one.',
    user_not_exists: "User doesn't exists for the following phone number.",
    user_not_exists_id: "User doesn't exists for the following id.",
    privacy_not_exists: "Privacy Policy doesn't exists.",
    terms_not_exists: "Terms doesn't exists.",
    error_with_twilio: 'Error with Twillio need to debug further.',
    error_with_textlocal: 'Error with Text Local need to debug further.',
    incorrect_password: 'It is wrong password please enter correct password.',
    incorrect_img_format: 'Incorrect image format, use valid one.',
};
exports.USER_ROLE = {
    ADMIN: 'ADMIN',
    MEMBER: 'MEMBER',
};
exports.GENDER_CONST = {
    MALE: 'MALE',
    FEMALE: 'FEMALE',
    OTHER: 'OTHER',
};
exports.FILE_LIMIT = 20000000;
exports.APP_IMPROVEMENT_TYPES = 'app-improvement-types';
exports.QUICK_CONTACTS = 'quick-contacts';
exports.PRIVACY_POLICIES = 'privacy-policies';
exports.TERMS_CONDITIONS = 'terms-conditions';
exports.OTP_VALIDATIONS = 'otp-validations';
exports.USERS = 'users';
exports.USER_SUGGESTION_IMPROVEMENTS = 'user-suggestion-improvements';
exports.profileImageFolder = 'profile-img/';
//# sourceMappingURL=constants.js.map