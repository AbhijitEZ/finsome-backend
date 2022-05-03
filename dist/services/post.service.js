"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const countries_1 = tslib_1.__importDefault(require("../models/countries"));
const posts_1 = tslib_1.__importDefault(require("../models/posts"));
const stock_types_1 = tslib_1.__importDefault(require("../models/stock-types"));
const user_configurations_1 = tslib_1.__importDefault(require("../models/user-configurations"));
const constants_1 = require("../utils/constants");
class PostService {
    constructor() {
        this.countryObj = countries_1.default;
        this.stockTypesObj = stock_types_1.default;
        this.userConfigObj = user_configurations_1.default;
    }
    async countriesGetAll() {
        const countries = await this.countryObj.find({}).lean();
        return countries;
    }
    async stockTypesShares(reqData) {
        var _a, _b;
        let stQb = this.stockTypesObj.find({
            s_type: reqData.type,
        });
        if (reqData.type === constants_1.STOCK_TYPE_CONST.EQUITY && reqData.country_code) {
            stQb = stQb.and([{ country_code: reqData.country_code }]);
        }
        if (reqData.search) {
            stQb = stQb.and([{ $or: [{ name: { $regex: `.*${reqData.search}.*`, $options: 'i' } }, { code: reqData.search }] }]);
        }
        const QueryCloned = stQb.toConstructor();
        const totalCountQuery = new QueryCloned();
        const stocks = reqData.has_all_data
            ? await stQb.exec()
            : await stQb
                .limit(parseInt((_a = reqData.limit) !== null && _a !== void 0 ? _a : constants_1.LIMIT_DEF))
                .skip(parseInt((_b = reqData.skip) !== null && _b !== void 0 ? _b : constants_1.SKIP_DEF))
                .exec();
        const total_count = await totalCountQuery.count();
        return { stocks, total_count };
    }
    async userConfigListing(_id) {
        const userConfig = await this.userConfigObj.findOne({ user_id: _id }).lean();
        return userConfig || {};
    }
    async userConfigUpdate(_id, reqData) {
        const userConfig = await this.userConfigObj.findOne({ user_id: _id }).lean();
        if (userConfig) {
            const newConfig = await this.userConfigObj.findByIdAndUpdate(userConfig._id, Object.assign({ user_id: _id }, reqData), { new: true });
            // @ts-ignore
            return newConfig._doc;
        }
        const newConfig = await this.userConfigObj.create(Object.assign(Object.assign({}, reqData), { user_id: _id }));
        // @ts-ignore
        return newConfig._doc;
    }
    async postCreate(_id, reqData) {
        // WAYROUND PATCH
        const payloadNew = Object.assign(Object.assign({}, reqData), { is_recommended: reqData.is_recommended === 'true' ? true : false });
        const postNew = await posts_1.default.create(Object.assign({ user_id: _id }, payloadNew));
        // @ts-ignore
        return postNew._doc;
    }
}
exports.default = PostService;
//# sourceMappingURL=post.service.js.map