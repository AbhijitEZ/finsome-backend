"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockTypeDto = void 0;
const tslib_1 = require("tslib");
const constants_1 = require("../utils/constants");
const class_validator_1 = require("class-validator");
const general_dto_1 = require("./general.dto");
class StockTypeDto extends general_dto_1.PaginationDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(Object.keys(constants_1.STOCK_TYPE_CONST)),
    tslib_1.__metadata("design:type", String)
], StockTypeDto.prototype, "type", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], StockTypeDto.prototype, "search", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], StockTypeDto.prototype, "country_code", void 0);
exports.StockTypeDto = StockTypeDto;
//# sourceMappingURL=posts.dto.js.map