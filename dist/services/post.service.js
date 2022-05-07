"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const countries_1 = tslib_1.__importDefault(require("../models/countries"));
const posts_1 = tslib_1.__importDefault(require("../models/posts"));
const aws_1 = tslib_1.__importDefault(require("../utils/aws"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const stock_types_1 = tslib_1.__importDefault(require("../models/stock-types"));
const user_configurations_1 = tslib_1.__importDefault(require("../models/user-configurations"));
const lodash_1 = require("lodash");
const constants_1 = require("../utils/constants");
const util_1 = require("../utils/util");
const global_1 = require("../utils/global");
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
    async postCreate(_id, reqData, files) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        // WAYROUND PATCH
        const payloadNew = Object.assign(Object.assign({}, reqData), { is_recommended: reqData.is_recommended === 'true' ? true : false });
        let post_images = [], post_thumbs = [], post_vids = [];
        /* At present everything is synchronous */
        if (!(0, lodash_1.isEmpty)(files)) {
            if ((_a = files === null || files === void 0 ? void 0 : files.post_images) === null || _a === void 0 ? void 0 : _a.length) {
                post_images = await Promise.all((_b = files === null || files === void 0 ? void 0 : files.post_images) === null || _b === void 0 ? void 0 : _b.map(async (file) => {
                    const fileContent = await fs_1.default.readFileSync(file.path);
                    const fileData = await aws_1.default.addAssets(file, constants_1.postAssetsFolder, fileContent);
                    return fileData;
                }));
            }
            if ((_c = files === null || files === void 0 ? void 0 : files.post_thumbs) === null || _c === void 0 ? void 0 : _c.length) {
                post_thumbs = await Promise.all((_d = files === null || files === void 0 ? void 0 : files.post_thumbs) === null || _d === void 0 ? void 0 : _d.map(async (file) => {
                    const fileContent = await fs_1.default.readFileSync(file.path);
                    const fileData = await aws_1.default.addAssets(file, constants_1.postAssetsFolder, fileContent);
                    return fileData;
                }));
            }
            if ((_e = files === null || files === void 0 ? void 0 : files.post_vids) === null || _e === void 0 ? void 0 : _e.length) {
                post_vids = await Promise.all((_f = files === null || files === void 0 ? void 0 : files.post_vids) === null || _f === void 0 ? void 0 : _f.map(async (file) => {
                    const fileContent = await fs_1.default.readFileSync(file.path);
                    const fileData = await aws_1.default.addAssets(file, constants_1.postAssetsFolder, fileContent);
                    return fileData;
                }));
            }
        }
        payloadNew.post_images = post_images;
        payloadNew.post_thumbs = post_thumbs;
        payloadNew.post_vids = post_vids;
        const postNew = await posts_1.default.create(Object.assign({ user_id: _id }, payloadNew));
        if (!(0, lodash_1.isEmpty)(files)) {
            (_g = files === null || files === void 0 ? void 0 : files.post_images) === null || _g === void 0 ? void 0 : _g.map(file => {
                (0, util_1.fileUnSyncFromLocalStroage)(file.path);
            });
            (_h = files === null || files === void 0 ? void 0 : files.post_vids) === null || _h === void 0 ? void 0 : _h.map(file => {
                (0, util_1.fileUnSyncFromLocalStroage)(file.path);
            });
            (_j = files === null || files === void 0 ? void 0 : files.post_thumbs) === null || _j === void 0 ? void 0 : _j.map(file => {
                (0, util_1.fileUnSyncFromLocalStroage)(file.path);
            });
        }
        // @ts-ignore
        return (0, global_1.postResponseFilter)(postNew._doc);
    }
}
exports.default = PostService;
//# sourceMappingURL=post.service.js.map