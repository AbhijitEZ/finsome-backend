"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendNotificationDto = exports.PrivacyPolicyDto = exports.ToggleUserStatusDto = exports.AdminLoginDto = exports.IdDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class IdDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], IdDto.prototype, "id", void 0);
exports.IdDto = IdDto;
class AdminLoginDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmail)(),
    tslib_1.__metadata("design:type", String)
], AdminLoginDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    tslib_1.__metadata("design:type", String)
], AdminLoginDto.prototype, "password", void 0);
exports.AdminLoginDto = AdminLoginDto;
class ToggleUserStatusDto extends IdDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], ToggleUserStatusDto.prototype, "status", void 0);
exports.ToggleUserStatusDto = ToggleUserStatusDto;
class PrivacyPolicyDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PrivacyPolicyDto.prototype, "content", void 0);
exports.PrivacyPolicyDto = PrivacyPolicyDto;
class SendNotificationDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], SendNotificationDto.prototype, "title", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], SendNotificationDto.prototype, "body", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsArray)(),
    tslib_1.__metadata("design:type", Array)
], SendNotificationDto.prototype, "userIds", void 0);
exports.SendNotificationDto = SendNotificationDto;
//# sourceMappingURL=admin.dto.js.map