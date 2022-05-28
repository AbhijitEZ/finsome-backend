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
const comments_1 = tslib_1.__importDefault(require("../models/comments"));
const mongoose_1 = require("mongoose");
const likes_1 = tslib_1.__importDefault(require("../models/likes"));
const HttpException_1 = require("../exceptions/HttpException");
const complaints_1 = tslib_1.__importDefault(require("../models/complaints"));
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
            likes: 1,
            total_likes: 1,
            comments: 1,
            total_comments: 1,
            deleted_at: 1,
        };
        this.commentResObj = {
            _id: 1,
            parent_id: 1,
            message: 1,
            created_at: 1,
            updated_at: 1,
            user_id: 1,
            post_id: 1,
            created_at_tz: { $dateToString: { date: '$created_at', timezone: constants_1.DEFAULT_TIMEZONE, format: '%Y-%m-%dT%H:%M:%S.%LZ' } },
            user: 1,
            post: 1,
            reply: 1,
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
        const postsMapping = postsListing.map(post => (0, global_1.postResponseMapper)(post));
        return postsMapping;
    }
    async postHome(_id, queryData) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const postsQb = this.postsObj.aggregate([
            {
                $project: this.postResObj,
            },
            {
                $match: {
                    /* For getting all the data, would be used for admin panel */
                    user_id: (queryData === null || queryData === void 0 ? void 0 : queryData.has_all_data) ? { $ne: null } : _id,
                    deleted_at: { $eq: null },
                },
            },
            {
                $lookup: {
                    from: constants_1.USERS,
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [{ $project: { _id: 1, fullname: 1, email: 1, profile_photo: 1 } }],
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
                $lookup: {
                    from: constants_1.LIKES,
                    localField: '_id',
                    foreignField: 'post_id',
                    as: 'likes',
                    pipeline: [
                        {
                            $project: {
                                user_id: 1,
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    total_likes: { $size: '$likes' },
                },
            },
            {
                $lookup: {
                    from: constants_1.COMMENTS,
                    localField: '_id',
                    foreignField: 'post_id',
                    as: 'comments',
                    pipeline: [
                        {
                            $project: {
                                user_id: 1,
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    total_comments: { $size: '$comments' },
                },
            },
            {
                $lookup: {
                    from: constants_1.LIKES,
                    localField: '_id',
                    foreignField: 'post_id',
                    as: 'likes_status',
                    pipeline: [
                        {
                            $match: {
                                user_id: (queryData === null || queryData === void 0 ? void 0 : queryData.has_all_data) ? { $ne: null } : new mongoose_1.Types.ObjectId(_id),
                            },
                        },
                        {
                            $addFields: {
                                status: {
                                    $eq: ['$user_id', _id],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: -1,
                                status: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unset: ['likes', 'comments', 'post_stock'],
            },
            /* TODO: This needs to be updated according to views and comment */
            { $sort: { created_at: -1 } },
        ]);
        if (!(queryData === null || queryData === void 0 ? void 0 : queryData.has_all_data)) {
            postsQb.append({
                $unwind: {
                    path: '$likes_status',
                    preserveNullAndEmptyArrays: true,
                },
            });
        }
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
            const stockIds = queryData.stock_ids.split(',');
            postsQb.append({
                $match: {
                    'security._id': {
                        $in: stockIds.map(id => new mongoose_1.Types.ObjectId(id)),
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
                $facet: {
                    totalRecords: [
                        {
                            $count: 'total',
                        },
                    ],
                    result: [
                        {
                            $skip: parseInt((_a = queryData.skip) !== null && _a !== void 0 ? _a : constants_1.SKIP_DEF),
                        },
                        {
                            $limit: parseInt((_b = queryData.limit) !== null && _b !== void 0 ? _b : constants_1.LIMIT_DEF),
                        },
                    ],
                },
            });
        }
        if (queryData.has_all_data) {
            postsQb.append({
                $facet: {
                    totalRecords: [
                        {
                            $count: 'total',
                        },
                    ],
                    result: [],
                },
            });
        }
        const posts = await postsQb.exec();
        const total_count = (_f = (_e = (_d = (_c = posts === null || posts === void 0 ? void 0 : posts[0]) === null || _c === void 0 ? void 0 : _c.totalRecords) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.total) !== null && _f !== void 0 ? _f : 0;
        const result = (_h = (_g = posts === null || posts === void 0 ? void 0 : posts[0]) === null || _g === void 0 ? void 0 : _g.result) !== null && _h !== void 0 ? _h : [];
        const postsMapping = result.map(post => (0, global_1.postResponseMapper)(post));
        return { result: postsMapping, total_count };
    }
    async postCreate(_id, reqData, files, postId) {
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
        let postData = {};
        if (postId) {
            postData = await posts_1.default.findByIdAndUpdate(postId, Object.assign({ user_id: _id }, payloadNew), { new: true });
        }
        else {
            postData = await posts_1.default.create(Object.assign({ user_id: _id }, payloadNew));
        }
        if ((_g = reqData.post_security_ids) === null || _g === void 0 ? void 0 : _g.length) {
            if (postId) {
                // @ts-ignore
                const postStockDeletedCount = await post_stocks_1.default.deleteMany({
                    post_id: postId,
                });
                console.log('DELETE post stock on update: ', (postStockDeletedCount === null || postStockDeletedCount === void 0 ? void 0 : postStockDeletedCount.deletedCount) || 0);
            }
            const postSecurityIds = reqData.post_security_ids.map(security => ({ post_id: postData._id, stock_id: security }));
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
        const data = await this.singlePostAggreData(String(postData._id), _id);
        return data;
    }
    async postDetail(userId, postId) {
        const data = await this.singlePostAggreData(postId, userId);
        return data;
    }
    async postDelete(userId, postId) {
        const postData = await posts_1.default
            .findOne({
            user_id: userId,
            _id: new mongoose_1.Types.ObjectId(postId),
        })
            .lean();
        if (!postData) {
            throw new HttpException_1.HttpException(400, constants_1.APP_ERROR_MESSAGE.post_not_exists);
        }
        await posts_1.default.findByIdAndUpdate(postData._id, {
            deleted_at: new Date(),
        });
        // @ts-ignore
        return postData;
    }
    async postDeleteAssets(userId, postId, indexId, type) {
        const post = await posts_1.default.findOne({
            _id: { $eq: postId },
        });
        if (!post) {
            throw new HttpException_1.HttpException(400, constants_1.APP_ERROR_MESSAGE.post_not_exists);
        }
        let assets = post[type];
        assets = assets.filter((asset, inx) => {
            if (inx === indexId) {
                aws_1.default.deletePostAsset(asset);
                return false;
            }
            return true;
        });
        await posts_1.default.findByIdAndUpdate(postId, { [type]: assets });
        const data = await this.singlePostAggreData(postId, userId);
        return data;
    }
    async commentListing(userId, reqData) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const commentQB = comments_1.default.aggregate([
            {
                $project: this.commentResObj,
            },
            {
                $match: {
                    post_id: new mongoose_1.Types.ObjectId(reqData.id),
                    parent_id: { $eq: null },
                    deleted_at: { $eq: null },
                },
            },
            {
                $lookup: {
                    from: constants_1.USERS,
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [{ $project: { _id: 1, fullname: 1, email: 1, profile_photo: 1 } }],
                },
            },
            { $unwind: '$user' },
            {
                $lookup: {
                    from: constants_1.POSTS,
                    localField: 'post_id',
                    foreignField: '_id',
                    as: 'post',
                    pipeline: [{ $project: { _id: 1 } }],
                },
            },
            { $unwind: '$post' },
            {
                $lookup: {
                    from: constants_1.COMMENTS,
                    localField: '_id',
                    foreignField: 'parent_id',
                    as: 'reply',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                post_id: 1,
                                user_id: 1,
                                message: 1,
                                created_at: 1,
                                created_at_tz: { $dateToString: { date: '$created_at', timezone: constants_1.DEFAULT_TIMEZONE, format: '%Y-%m-%dT%H:%M:%S.%LZ' } },
                            },
                        },
                        {
                            $lookup: {
                                from: constants_1.USERS,
                                localField: 'user_id',
                                foreignField: '_id',
                                as: 'reply_user',
                                pipeline: [{ $project: { _id: 1, fullname: 1, email: 1, profile_photo: 1 } }],
                            },
                        },
                        { $unwind: '$reply_user' },
                    ],
                },
            },
            {
                $unset: ['user_id', 'post_id'],
            },
            {
                $sort: {
                    created_at: -1,
                },
            },
        ]);
        if (!reqData.has_all_data) {
            commentQB.append({
                $facet: {
                    totalRecords: [
                        {
                            $count: 'total',
                        },
                    ],
                    result: [
                        {
                            $skip: parseInt((_a = reqData.skip) !== null && _a !== void 0 ? _a : constants_1.SKIP_DEF),
                        },
                        {
                            $limit: parseInt((_b = reqData.limit) !== null && _b !== void 0 ? _b : constants_1.LIMIT_DEF),
                        },
                    ],
                },
            });
        }
        if (reqData.has_all_data) {
            commentQB.append({
                $facet: {
                    totalRecords: [
                        {
                            $count: 'total',
                        },
                    ],
                    result: [],
                },
            });
        }
        let commentsData = await commentQB.exec();
        const total_count = (_f = (_e = (_d = (_c = commentsData === null || commentsData === void 0 ? void 0 : commentsData[0]) === null || _c === void 0 ? void 0 : _c.totalRecords) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.total) !== null && _f !== void 0 ? _f : 0;
        const result = (_h = (_g = commentsData === null || commentsData === void 0 ? void 0 : commentsData[0]) === null || _g === void 0 ? void 0 : _g.result) !== null && _h !== void 0 ? _h : [];
        commentsData = (_j = result === null || result === void 0 ? void 0 : result.map(comm => (0, global_1.commentResponseMapper)(comm))) !== null && _j !== void 0 ? _j : [];
        return { result: commentsData, total_count };
    }
    async commentAdd(userId, reqData) {
        var _a;
        const newComment = await comments_1.default.create({
            user_id: userId,
            post_id: reqData.post_id,
            message: reqData.message,
            parent_id: (_a = reqData.parent_id) !== null && _a !== void 0 ? _a : null,
        });
        const commentCounts = await comments_1.default.countDocuments({
            post_id: reqData.post_id,
            parent_id: {
                $eq: null,
            },
        });
        if (reqData.parent_id) {
            const commentQB = comments_1.default.aggregate([
                {
                    $project: this.commentResObj,
                },
                {
                    $match: {
                        _id: new mongoose_1.Types.ObjectId(reqData.parent_id),
                        post_id: new mongoose_1.Types.ObjectId(reqData.post_id),
                        parent_id: { $eq: null },
                        deleted_at: undefined,
                    },
                },
                {
                    $lookup: {
                        from: constants_1.USERS,
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'user',
                        pipeline: [{ $project: { _id: 1, fullname: 1, email: 1, profile_photo: 1 } }],
                    },
                },
                { $unwind: '$user' },
                {
                    $lookup: {
                        from: constants_1.POSTS,
                        localField: 'post_id',
                        foreignField: '_id',
                        as: 'post',
                        pipeline: [{ $project: { _id: 1 } }],
                    },
                },
                { $unwind: '$post' },
                {
                    $lookup: {
                        from: constants_1.COMMENTS,
                        localField: '_id',
                        foreignField: 'parent_id',
                        as: 'reply',
                        pipeline: [
                            {
                                $project: {
                                    _id: 1,
                                    post_id: 1,
                                    user_id: 1,
                                    message: 1,
                                    created_at: 1,
                                    created_at_tz: { $dateToString: { date: '$created_at', timezone: constants_1.DEFAULT_TIMEZONE, format: '%Y-%m-%dT%H:%M:%S.%LZ' } },
                                },
                            },
                            {
                                $lookup: {
                                    from: constants_1.USERS,
                                    localField: 'user_id',
                                    foreignField: '_id',
                                    as: 'reply_user',
                                    pipeline: [{ $project: { _id: 1, fullname: 1, email: 1, profile_photo: 1 } }],
                                },
                            },
                            { $unwind: '$reply_user' },
                        ],
                    },
                },
                {
                    $unset: ['user_id', 'post_id'],
                },
                {
                    $sort: {
                        created_at: -1,
                    },
                },
            ]);
            const commentsData = await commentQB.exec();
            return {
                total_count: commentCounts,
                // @ts-ignore
                result: [(0, global_1.commentResponseMapper)(commentsData === null || commentsData === void 0 ? void 0 : commentsData[0])],
            };
        }
        const commentQB = comments_1.default.aggregate([
            {
                $project: this.commentResObj,
            },
            {
                $match: {
                    _id: new mongoose_1.Types.ObjectId(newComment._id),
                    post_id: new mongoose_1.Types.ObjectId(reqData.post_id),
                    parent_id: { $eq: null },
                    deleted_at: undefined,
                },
            },
            {
                $lookup: {
                    from: constants_1.USERS,
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [{ $project: { _id: 1, fullname: 1, email: 1, profile_photo: 1 } }],
                },
            },
            { $unwind: '$user' },
            {
                $lookup: {
                    from: constants_1.POSTS,
                    localField: 'post_id',
                    foreignField: '_id',
                    as: 'post',
                    pipeline: [{ $project: { _id: 1 } }],
                },
            },
            { $unwind: '$post' },
            {
                $unset: ['user_id', 'post_id'],
            },
            {
                $sort: {
                    created_at: -1,
                },
            },
        ]);
        const commentsData = await commentQB.exec();
        // @ts-ignore
        return {
            total_count: commentCounts,
            // @ts-ignore
            result: [(0, global_1.commentResponseMapper)(commentsData === null || commentsData === void 0 ? void 0 : commentsData[0])],
        };
    }
    async commentDelete(userId, postId, commentId) {
        const commentCheck = await comments_1.default.findOne({
            _id: new mongoose_1.Types.ObjectId(commentId),
            user_id: userId,
        });
        if (!commentCheck) {
            throw new HttpException_1.HttpException(403, constants_1.APP_ERROR_MESSAGE.user_not_auth);
        }
        await comments_1.default.deleteOne({
            _id: new mongoose_1.Types.ObjectId(commentId),
        });
        const commentCounts = await comments_1.default.countDocuments({
            post_id: postId,
            parent_id: {
                $eq: null,
            },
        });
        // @ts-ignore
        return commentCounts;
    }
    async postLikeUpdate(userId, reqData) {
        var _a, _b;
        const likeExistsForUser = await likes_1.default.findOne({
            user_id: userId,
            post_id: reqData.post_id,
        });
        if (reqData.like && likeExistsForUser) {
            throw new HttpException_1.HttpException(400, constants_1.APP_ERROR_MESSAGE.post_like_exists);
        }
        if (!reqData.like && !likeExistsForUser) {
            throw new HttpException_1.HttpException(400, constants_1.APP_ERROR_MESSAGE.post_not_like_exists);
        }
        if (reqData.like) {
            await likes_1.default.create({ user_id: userId, post_id: reqData.post_id });
        }
        else {
            await likes_1.default.deleteOne({ user_id: userId, post_id: reqData.post_id });
        }
        let likeQb = likes_1.default.aggregate([
            {
                $match: {
                    user_id: {
                        $eq: new mongoose_1.Types.ObjectId(userId),
                    },
                    post_id: {
                        $eq: new mongoose_1.Types.ObjectId(reqData.post_id),
                    },
                },
            },
            {
                $count: 'total_count',
            },
        ]);
        likeQb = await likeQb.exec();
        return (_b = (_a = likeQb === null || likeQb === void 0 ? void 0 : likeQb[0]) === null || _a === void 0 ? void 0 : _a.total_count) !== null && _b !== void 0 ? _b : 0;
    }
    async complaintAdd(userId, reqData) {
        var _a, _b, _c;
        if (!reqData.post_complain_id && !reqData.user_complain_id) {
            throw new HttpException_1.HttpException(400, constants_1.APP_ERROR_MESSAGE.post_complain_usr_complain_exists);
        }
        const newComlaint = await complaints_1.default.create({
            post_complain_id: (_a = reqData.post_complain_id) !== null && _a !== void 0 ? _a : null,
            user_complain_id: (_b = reqData.user_complain_id) !== null && _b !== void 0 ? _b : null,
            user_id: userId,
            reason: reqData.reason,
            description: (_c = reqData.description) !== null && _c !== void 0 ? _c : null,
        });
        // @ts-ignore
        return newComlaint._doc;
    }
    async singlePostAggreData(postId, userId) {
        var _a;
        const postsQb = this.postsObj.aggregate([
            {
                $project: this.postResObj,
            },
            { $match: { $expr: { $eq: ['$_id', { $toObjectId: new mongoose_1.Types.ObjectId(postId) }] } } },
            {
                $lookup: {
                    from: constants_1.USERS,
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [{ $project: { _id: 1, fullname: 1, email: 1, profile_photo: 1 } }],
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
                $lookup: {
                    from: constants_1.LIKES,
                    localField: '_id',
                    foreignField: 'post_id',
                    as: 'likes',
                    pipeline: [
                        {
                            $project: {
                                user_id: 1,
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    total_likes: { $size: '$likes' },
                },
            },
            {
                $lookup: {
                    from: constants_1.COMMENTS,
                    localField: '_id',
                    foreignField: 'post_id',
                    as: 'comments',
                    pipeline: [
                        {
                            $project: {
                                user_id: 1,
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    total_comments: { $size: '$comments' },
                },
            },
            {
                $lookup: {
                    from: constants_1.LIKES,
                    localField: '_id',
                    foreignField: 'post_id',
                    as: 'likes_status',
                    pipeline: [
                        {
                            $match: {
                                user_id: new mongoose_1.Types.ObjectId(userId),
                            },
                        },
                        {
                            $addFields: {
                                status: {
                                    $eq: ['$user_id', userId],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: -1,
                                status: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unset: ['likes', 'comments', 'post_stock'],
            },
            /* TODO: This needs to be updated according to views and comment */
            { $sort: { created_at: -1 } },
        ]);
        const post = await postsQb.exec();
        if (!post.length) {
            throw new HttpException_1.HttpException(400, constants_1.APP_ERROR_MESSAGE.post_not_exists);
        }
        // @ts-ignore
        return (0, global_1.postResponseMapper)((_a = post === null || post === void 0 ? void 0 : post[0]) !== null && _a !== void 0 ? _a : {});
    }
}
exports.default = PostService;
//# sourceMappingURL=post.service.js.map