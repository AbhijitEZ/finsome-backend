"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const countries_1 = tslib_1.__importDefault(require("../models/countries"));
const posts_1 = tslib_1.__importDefault(require("../models/posts"));
const aws_1 = tslib_1.__importDefault(require("../utils/aws"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const stock_types_1 = tslib_1.__importDefault(require("../models/stock-types"));
const user_configurations_1 = tslib_1.__importDefault(require("../models/user-configurations"));
const lodash_isempty_1 = tslib_1.__importDefault(require("lodash.isempty"));
const constants_1 = require("../utils/constants");
const util_1 = require("../utils/util");
const global_1 = require("../utils/global");
const date_fns_1 = require("date-fns");
const date_fns_timezone_1 = require("date-fns-timezone");
const post_stocks_1 = tslib_1.__importDefault(require("../models/post-stocks"));
class PostService {
    constructor() {
        this.countryObj = countries_1.default;
        this.stockTypesObj = stock_types_1.default;
        this.userConfigObj = user_configurations_1.default;
        this.postsObj = posts_1.default;
        this.postResObj = {
            _id: 1,
            is_recommended: 1,
            post_images: 1,
            post_thumbs: 1,
            post_vids: 1,
            user_id: 1,
            stock_type: 1,
            post_stock: 1,
            analysis_type: 1,
            trade_type: 1,
            security_id: 1,
            stock_recommended_type: 1,
            buy_recommend_amount: 1,
            sell_recommend_amount: 1,
            caption: 1,
            created_at: 1,
            updated_at: 1,
            created_at_tz: { $dateToString: { date: '$created_at', timezone: constants_1.DEFAULT_TIMEZONE, format: '%Y-%m-%dT%H:%M:%S.%LZ' } },
            user: 1,
            security: 1,
        };
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async postExplore(_id) {
        const postsListing = await posts_1.default.find({ deleted_at: undefined }).populate('user_id', ['fullname', 'email']).lean();
        const postsMapping = postsListing.map(post => (0, global_1.postResponseFilter)(post));
        return postsMapping;
    }
    async postHome(_id, queryData) {
        var _a, _b;
        const postsQb = this.postsObj.aggregate([
            {
                $project: this.postResObj,
            },
            {
                $match: {
                    /* For getting all the data, would be used for admin panel */
                    user_id: (queryData === null || queryData === void 0 ? void 0 : queryData.has_all_data) ? { $ne: null } : _id,
                    deleted_at: undefined,
                },
            },
            {
                $lookup: {
                    from: constants_1.USERS,
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [{ $project: { _id: 1, fullname: 1, email: 1 } }],
                },
            },
            { $unwind: '$user' },
            {
                $lookup: {
                    from: constants_1.POST_STOCKS,
                    localField: '_id',
                    foreignField: 'post_id',
                    as: 'post_stock',
                },
            },
            {
                $lookup: {
                    from: constants_1.STOCK_TYPES,
                    localField: 'post_stock.stock_id',
                    foreignField: '_id',
                    as: 'security',
                    pipeline: [{ $project: { _id: 1, s_type: 1, name: 1, country_code: 1 } }],
                },
            },
            {
                $unset: ['post_stock'],
            },
            /* TODO: This needs to be updated according to views and comment */
            { $sort: { created_at: -1 } },
        ]);
        if (queryData.type) {
            postsQb.append({
                $match: {
                    stock_type: queryData.type,
                },
            });
        }
        if (queryData.country_code) {
            postsQb.append({
                $match: {
                    security: {
                        $elemMatch: {
                            country_code: queryData.country_code,
                        },
                    },
                },
            });
        }
        if (queryData.is_recommended) {
            postsQb.append({
                $match: {
                    is_recommended: true,
                },
            });
        }
        if (queryData.analysis_type) {
            postsQb.append({
                $match: {
                    analysis_type: queryData.analysis_type,
                },
            });
        }
        if (queryData.trade_type) {
            postsQb.append({
                $match: {
                    trade_type: queryData.trade_type,
                },
            });
        }
        if (queryData.stock_ids) {
            postsQb.append({
                $match: {
                    security: {
                        $elemMatch: {
                            stock_id: {
                                $in: queryData.stock_ids,
                            },
                        },
                    },
                },
            });
        }
        /* NOTE: Require testing for the different timezone */
        if (queryData.date) {
            const date = queryData.date + 'T00:00:00.Z';
            postsQb.append({
                $match: {
                    created_at: {
                        $gte: (0, date_fns_timezone_1.convertToLocalTime)((0, date_fns_1.toDate)((0, date_fns_1.parseISO)(date)), { timeZone: constants_1.DEFAULT_TIMEZONE }),
                        $lt: (0, date_fns_1.addDays)((0, date_fns_timezone_1.convertToLocalTime)((0, date_fns_1.toDate)((0, date_fns_1.parseISO)(date)), { timeZone: constants_1.DEFAULT_TIMEZONE }), 1),
                    },
                },
            });
        }
        if (!queryData.has_all_data) {
            postsQb.append({
                $limit: parseInt((_a = queryData.limit) !== null && _a !== void 0 ? _a : constants_1.LIMIT_DEF),
            });
            postsQb.append({
                $skip: parseInt((_b = queryData.skip) !== null && _b !== void 0 ? _b : constants_1.SKIP_DEF),
            });
        }
        const posts = await postsQb.exec();
        const postsMapping = posts.map(post => (0, global_1.postResponseFilter)(post));
        return postsMapping;
    }
    async postCreate(_id, reqData, files) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        // WAYROUND PATCH
        const payloadNew = Object.assign(Object.assign({}, reqData), { is_recommended: reqData.is_recommended === 'true' ? true : false });
        let post_images = [], post_thumbs = [], post_vids = [];
        /* At present everything is synchronous */
        if (!(0, lodash_isempty_1.default)(files)) {
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
        if ((_g = reqData.post_security_ids) === null || _g === void 0 ? void 0 : _g.length) {
            const postSecurityIds = reqData.post_security_ids.map(security => ({ post_id: postNew._id, stock_id: security }));
            await post_stocks_1.default.insertMany(postSecurityIds);
        }
        if (!(0, lodash_isempty_1.default)(files)) {
            (_h = files === null || files === void 0 ? void 0 : files.post_images) === null || _h === void 0 ? void 0 : _h.map(file => {
                (0, util_1.fileUnSyncFromLocalStroage)(file.path);
            });
            (_j = files === null || files === void 0 ? void 0 : files.post_vids) === null || _j === void 0 ? void 0 : _j.map(file => {
                (0, util_1.fileUnSyncFromLocalStroage)(file.path);
            });
            (_k = files === null || files === void 0 ? void 0 : files.post_thumbs) === null || _k === void 0 ? void 0 : _k.map(file => {
                (0, util_1.fileUnSyncFromLocalStroage)(file.path);
            });
        }
        // @ts-ignore
        return (0, global_1.postResponseFilter)(postNew._doc);
    }
}
exports.default = PostService;
//# sourceMappingURL=post.service.js.map