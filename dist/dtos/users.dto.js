"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSubscriptionDto = exports.NotificationMarkReadDto = exports.DeviceTokenLogoutDto = exports.UserListingRateDto = exports.UserListingDto = exports.UserRateDto = exports.FollowDto = exports.QuickContactDto = exports.AppImprovementUserDto = exports.NotificationDto = exports.ProfileUpdateDto = exports.ResetPasswordDto = exports.ChangePasswordDto = exports.LoginDto = exports.CreateUserDto = exports.SignupPhoneDto = exports.ValidateUserFieldDto = exports.VerifyOtpDTO = exports.VerifyPhoneDto = void 0;
const tslib_1 = require("tslib");
const constants_1 = require("../utils/constants");
const class_validator_1 = require("class-validator");
const general_dto_1 = require("./general.dto");
class VerifyPhoneDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], VerifyPhoneDto.prototype, "phone_country_code", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], VerifyPhoneDto.prototype, "phone_number", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], VerifyPhoneDto.prototype, "is_testing", void 0);
exports.VerifyPhoneDto = VerifyPhoneDto;
class VerifyOtpDTO extends VerifyPhoneDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], VerifyOtpDTO.prototype, "otp", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], VerifyOtpDTO.prototype, "is_reset_password", void 0);
exports.VerifyOtpDTO = VerifyOtpDTO;
class ValidateUserFieldDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['phone_number', 'username', 'email']),
    tslib_1.__metadata("design:type", String)
], ValidateUserFieldDto.prototype, "field", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], ValidateUserFieldDto.prototype, "value", void 0);
exports.ValidateUserFieldDto = ValidateUserFieldDto;
class SignupPhoneDto extends VerifyOtpDTO {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    tslib_1.__metadata("design:type", String)
], SignupPhoneDto.prototype, "password", void 0);
exports.SignupPhoneDto = SignupPhoneDto;
class CreateUserDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "id", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "username", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "fullname", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "birth_date", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "trading_exp", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(Object.keys(constants_1.GENDER_CONST)),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "gender", void 0);
exports.CreateUserDto = CreateUserDto;
class LoginDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], LoginDto.prototype, "phone_number", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    tslib_1.__metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
exports.LoginDto = LoginDto;
class ChangePasswordDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    tslib_1.__metadata("design:type", String)
], ChangePasswordDto.prototype, "password", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    tslib_1.__metadata("design:type", String)
], ChangePasswordDto.prototype, "new_password", void 0);
exports.ChangePasswordDto = ChangePasswordDto;
class ResetPasswordDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], ResetPasswordDto.prototype, "id", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    tslib_1.__metadata("design:type", String)
], ResetPasswordDto.prototype, "password", void 0);
exports.ResetPasswordDto = ResetPasswordDto;
class ProfileUpdateDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    tslib_1.__metadata("design:type", String)
], ProfileUpdateDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], ProfileUpdateDto.prototype, "username", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], ProfileUpdateDto.prototype, "fullname", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", String)
], ProfileUpdateDto.prototype, "birth_date", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], ProfileUpdateDto.prototype, "trading_exp", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(Object.keys(constants_1.GENDER_CONST)),
    tslib_1.__metadata("design:type", String)
], ProfileUpdateDto.prototype, "gender", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], ProfileUpdateDto.prototype, "bio", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], ProfileUpdateDto.prototype, "youtube_link", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], ProfileUpdateDto.prototype, "instagram_link", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], ProfileUpdateDto.prototype, "telegram_link", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], ProfileUpdateDto.prototype, "remove_photo", void 0);
exports.ProfileUpdateDto = ProfileUpdateDto;
class NotificationDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], NotificationDto.prototype, "allow_notification", void 0);
exports.NotificationDto = NotificationDto;
class AppImprovementUserDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], AppImprovementUserDto.prototype, "id", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], AppImprovementUserDto.prototype, "description", void 0);
exports.AppImprovementUserDto = AppImprovementUserDto;
class QuickContactDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], QuickContactDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    tslib_1.__metadata("design:type", String)
], QuickContactDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], QuickContactDto.prototype, "message", void 0);
exports.QuickContactDto = QuickContactDto;
class FollowDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], FollowDto.prototype, "following_id", void 0);
exports.FollowDto = FollowDto;
class UserRateDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], UserRateDto.prototype, "rate", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UserRateDto.prototype, "comment", void 0);
exports.UserRateDto = UserRateDto;
class UserListingDto extends general_dto_1.PaginationDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UserListingDto.prototype, "search", void 0);
exports.UserListingDto = UserListingDto;
class UserListingRateDto extends general_dto_1.PaginationDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UserListingRateDto.prototype, "has_all_data", void 0);
exports.UserListingRateDto = UserListingRateDto;
class DeviceTokenLogoutDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], DeviceTokenLogoutDto.prototype, "device_token", void 0);
exports.DeviceTokenLogoutDto = DeviceTokenLogoutDto;
class NotificationMarkReadDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)({ each: true }),
    tslib_1.__metadata("design:type", Array)
], NotificationMarkReadDto.prototype, "notification_ids", void 0);
exports.NotificationMarkReadDto = NotificationMarkReadDto;
class NotificationSubscriptionDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], NotificationSubscriptionDto.prototype, "is_notify", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], NotificationSubscriptionDto.prototype, "subscribe_to_id", void 0);
exports.NotificationSubscriptionDto = NotificationSubscriptionDto;
//# sourceMappingURL=users.dto.js.map