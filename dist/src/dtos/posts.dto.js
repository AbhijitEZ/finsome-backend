"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockSearchDto = exports.PostAssetDeleteDto = exports.ComplaintAddDto = exports.LikePostDto = exports.CommentsAddDto = exports.PostHomeDto = exports.PostCreateDto = exports.UserConfigurationDto = exports.StockUpdateTypeDto = exports.StockTypeDto = exports.IdPaginationDto = void 0;
const tslib_1 = require("tslib");
const constants_1 = require("../../utils/constants");
const class_validator_1 = require("class-validator");
const general_dto_1 = require("./general.dto");
class IdPaginationDto extends general_dto_1.PaginationDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], IdPaginationDto.prototype, "id", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Boolean)
], IdPaginationDto.prototype, "has_all_data", void 0);
exports.IdPaginationDto = IdPaginationDto;
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
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], StockTypeDto.prototype, "has_all_data", void 0);
exports.StockTypeDto = StockTypeDto;
class StockUpdateTypeDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], StockUpdateTypeDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], StockUpdateTypeDto.prototype, "code", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], StockUpdateTypeDto.prototype, "image", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], StockUpdateTypeDto.prototype, "country_code", void 0);
exports.StockUpdateTypeDto = StockUpdateTypeDto;
class UserConfigurationDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(Object.keys(constants_1.STOCK_TYPE_CONST)),
    tslib_1.__metadata("design:type", String)
], UserConfigurationDto.prototype, "stock_type", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(Object.keys(constants_1.ANALYSIS_TYPE_CONST)),
    tslib_1.__metadata("design:type", String)
], UserConfigurationDto.prototype, "analysis_type", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(Object.keys(constants_1.TRADE_TYPE_CONST)),
    tslib_1.__metadata("design:type", String)
], UserConfigurationDto.prototype, "trade_type", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(Object.keys(constants_1.ACCOUNT_TYPE_CONST)),
    tslib_1.__metadata("design:type", String)
], UserConfigurationDto.prototype, "account_type", void 0);
exports.UserConfigurationDto = UserConfigurationDto;
class PostCreateDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(Object.keys(constants_1.STOCK_TYPE_CONST)),
    tslib_1.__metadata("design:type", String)
], PostCreateDto.prototype, "stock_type", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(Object.keys(constants_1.ANALYSIS_TYPE_CONST)),
    tslib_1.__metadata("design:type", String)
], PostCreateDto.prototype, "analysis_type", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(Object.keys(constants_1.TRADE_TYPE_CONST)),
    tslib_1.__metadata("design:type", String)
], PostCreateDto.prototype, "trade_type", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PostCreateDto.prototype, "security_id", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    tslib_1.__metadata("design:type", Array)
], PostCreateDto.prototype, "post_security_ids", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(Object.keys(constants_1.STOCK_RECOMMENDED_CONST)),
    tslib_1.__metadata("design:type", String)
], PostCreateDto.prototype, "stock_recommended_type", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PostCreateDto.prototype, "is_recommended", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PostCreateDto.prototype, "buy_recommend_amount", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PostCreateDto.prototype, "sell_recommend_amount", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PostCreateDto.prototype, "caption", void 0);
exports.PostCreateDto = PostCreateDto;
class PostHomeDto extends general_dto_1.PaginationDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(Object.keys(constants_1.STOCK_TYPE_CONST)),
    tslib_1.__metadata("design:type", String)
], PostHomeDto.prototype, "type", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PostHomeDto.prototype, "search", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PostHomeDto.prototype, "date", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PostHomeDto.prototype, "stock_ids", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PostHomeDto.prototype, "country_code", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PostHomeDto.prototype, "analysis_type", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PostHomeDto.prototype, "trade_type", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PostHomeDto.prototype, "is_recommended", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PostHomeDto.prototype, "has_all_data", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PostHomeDto.prototype, "user_id", void 0);
exports.PostHomeDto = PostHomeDto;
class CommentsAddDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CommentsAddDto.prototype, "post_id", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CommentsAddDto.prototype, "parent_id", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CommentsAddDto.prototype, "message", void 0);
exports.CommentsAddDto = CommentsAddDto;
class LikePostDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], LikePostDto.prototype, "like", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], LikePostDto.prototype, "post_id", void 0);
exports.LikePostDto = LikePostDto;
class ComplaintAddDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], ComplaintAddDto.prototype, "reason", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], ComplaintAddDto.prototype, "description", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], ComplaintAddDto.prototype, "post_complain_id", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], ComplaintAddDto.prototype, "user_complain_id", void 0);
exports.ComplaintAddDto = ComplaintAddDto;
class PostAssetDeleteDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PostAssetDeleteDto.prototype, "names", void 0);
exports.PostAssetDeleteDto = PostAssetDeleteDto;
class StockSearchDto extends general_dto_1.PaginationDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], StockSearchDto.prototype, "search", void 0);
exports.StockSearchDto = StockSearchDto;
//# sourceMappingURL=posts.dto.js.map