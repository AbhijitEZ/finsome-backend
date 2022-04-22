"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class PaginationDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PaginationDto.prototype, "skip", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PaginationDto.prototype, "limit", void 0);
exports.PaginationDto = PaginationDto;
//# sourceMappingURL=general.dto.js.map