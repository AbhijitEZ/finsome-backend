"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminLoginDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
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
//# sourceMappingURL=admin.dto.js.map