"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const config_1 = tslib_1.__importDefault(require("config"));
const jsonwebtoken_1 = require("jsonwebtoken");
const bcrypt_1 = require("bcrypt");
const HttpException_1 = require("../exceptions/HttpException");
const constants_1 = require("../utils/constants");
const users_model_1 = tslib_1.__importDefault(require("../models/users.model"));
const app_improvement_type_1 = tslib_1.__importDefault(require("../models/app-improvement-type"));
const util_1 = require("../utils/util");
const date_fns_1 = require("date-fns");
const quick_contact_1 = tslib_1.__importDefault(require("../models/quick-contact"));
const user_suggestion_improvement_1 = tslib_1.__importDefault(require("../models/user-suggestion-improvement"));
const privacy_policy_1 = tslib_1.__importDefault(require("../models/privacy-policy"));
const complaints_1 = tslib_1.__importDefault(require("../models/complaints"));
const terms_condition_1 = tslib_1.__importDefault(require("../models/terms-condition"));
const stock_types_1 = tslib_1.__importDefault(require("../models/stock-types"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const sync_1 = require("csv-parse/sync");
const posts_1 = tslib_1.__importDefault(require("../models/posts"));
const device_tokens_1 = tslib_1.__importDefault(require("../models/device-tokens"));
const user_followers_1 = tslib_1.__importDefault(require("../models/user-followers"));
const aws_1 = tslib_1.__importDefault(require("../utils/aws"));
const articles_1 = tslib_1.__importDefault(require("../models/articles"));
const article_categories_1 = tslib_1.__importDefault(require("../models/article-categories"));
const user_rates_1 = tslib_1.__importDefault(require("../models/user-rates"));
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
class AdminService {
    constructor() {
        this.users = users_model_1.default;
        this.appImprovement = app_improvement_type_1.default;
        this.quickContact = quick_contact_1.default;
        this.userSuggestion = user_suggestion_improvement_1.default;
        this.privacyPolicy = privacy_policy_1.default;
        this.termsConditionM = terms_condition_1.default;
        this.complaintM = complaints_1.default;
        this.getUserRating = async (userId) => {
            let avgRating = await user_rates_1.default
                .aggregate([
                {
                    $match: {
                        user_id: mongoose_1.default.Types.ObjectId(userId),
                    },
                },
                {
                    $group: {
                        _id: '$user_id',
                        avg: { $avg: '$rate' },
                    },
                },
            ])
                .exec();
            let postCount = await posts_1.default.countDocuments({ user_id: userId });
            let followingCount = await user_followers_1.default.countDocuments({ user_id: userId });
            let followerCount = await user_followers_1.default.countDocuments({ follower_id: userId });
            return { avgRating, postCount, followingCount, followerCount };
        };
    }
    async adminLogin(loginDto) {
        const adminUser = await this.users.findOne({
            email: loginDto.email,
            role: constants_1.USER_ROLE.ADMIN,
        });
        if (!adminUser) {
            throw new HttpException_1.HttpException(400, constants_1.APP_ERROR_MESSAGE.user_not_exists_id);
        }
        const isPasswordMatching = await (0, bcrypt_1.compare)(loginDto.password, adminUser.password);
        if (!isPasswordMatching)
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.incorrect_password);
        const dataStoredInToken = { _id: adminUser._id, role: adminUser.role };
        const secretKey = config_1.default.get('secretKey');
        const expiresIn = config_1.default.get('tokenExpiry');
        const token = (0, jsonwebtoken_1.sign)(dataStoredInToken, secretKey, { expiresIn });
        return { token };
    }
    async userListing(user, req) {
        const { page, limit, search, status } = req.body;
        const model = users_model_1.default;
        let searchRegex = new RegExp(search, 'i');
        let query = {
            _id: { $ne: user._id },
            role: { $ne: constants_1.USER_ROLE.ADMIN },
            $or: [{ fullname: searchRegex }, { phone_number: searchRegex }, { email: searchRegex }],
        };
        if (status != '') {
            if (status == 'true') {
                query['deleted_at'] = null;
            }
            else {
                query['deleted_at'] = { $ne: null };
            }
        }
        let users = await model.paginate(query, {
            page: page,
            limit: limit,
            lean: true,
            select: '-password -updated_at -term_agree_timestamp',
            sort: { created_at: -1 },
        });
        for (let i = 0; i < users.docs.length; i++) {
            users.docs[i].rating = await user_rates_1.default
                .aggregate([
                {
                    $match: {
                        user_id: mongoose_1.default.Types.ObjectId(users.docs[i]._id),
                    },
                },
                {
                    $group: {
                        _id: '$user_id',
                        avg: { $avg: '$rate' },
                    },
                },
            ])
                .exec();
        }
        let data = users.docs;
        const userSanitized = data.map(d => (Object.assign(Object.assign({}, d), { profile_photo: (0, util_1.profileImageGenerator)(d.profile_photo) })));
        users.docs = userSanitized;
        return users;
    }
    async dashboardData(user) {
        const users = await this.users
            .find({
            _id: { $ne: user._id },
            role: { $ne: constants_1.USER_ROLE.ADMIN },
        })
            .sort({ created_at: -1 })
            .lean();
        const appImproves = await this.appImprovement.countDocuments();
        const quickContacts = await this.quickContact.countDocuments();
        const suggestions = await this.userSuggestion.countDocuments();
        const postsCount = await posts_1.default.countDocuments({ deleted_at: null });
        const cryptPostCount = await posts_1.default.countDocuments({ stock_type: 'CRYPT', deleted_at: null });
        const equityPostCount = await posts_1.default.countDocuments({ stock_type: 'EQUITY', deleted_at: null });
        const generalPostCount = await posts_1.default.countDocuments({ stock_type: 'OTHER', deleted_at: null });
        let active_user = 0, inactive_user = 0, total_user = 0, completed_registered_user = 0;
        users.map(usr => {
            total_user = total_user + 1;
            if (usr.deleted_at) {
                inactive_user = inactive_user + 1;
            }
            if (!usr.deleted_at) {
                active_user = active_user + 1;
            }
            if (usr.is_registration_complete) {
                completed_registered_user = completed_registered_user + 1;
            }
        });
        return {
            active_user,
            inactive_user,
            total_user,
            completed_registered_user,
            app_improves: appImproves,
            quick_contacts: quickContacts,
            suggestions: suggestions,
            posts: postsCount,
            crypt_post: cryptPostCount,
            equity_post: equityPostCount,
            general_post: generalPostCount,
        };
    }
    async toggleUserStatus(user) {
        const findUser = await this.users.findOne({ _id: user.id }).lean();
        if (!findUser)
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.user_not_exists_id);
        await this.users.findByIdAndUpdate(user.id, { deleted_at: user.status ? (0, date_fns_1.toDate)(new Date()) : null }, { new: true });
    }
    async deleteUser(id) {
        const findUser = await this.users.findOne({ _id: id }).lean();
        if (!findUser)
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.user_not_exists_id);
        // ANCHOR This would be added on, when more models gets associated with Users.
        await this.userSuggestion.findOneAndDelete({ user_id: id }).exec();
        await this.users.findOneAndDelete({ _id: id }).exec();
    }
    async getUser(id) {
        const findUser = await this.users.findOne({ _id: id }).select('-password').lean();
        return findUser;
    }
    async privacyPolicyListing() {
        const findData = await this.privacyPolicy.findOne({}).lean();
        if (!findData) {
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.privacy_not_exists);
        }
        return findData;
    }
    async privacyPolicyUpdate(data) {
        const findData = await this.privacyPolicy.findOne({}).lean();
        if (!findData) {
            await this.privacyPolicy.create(Object.assign({}, data));
            return;
        }
        await this.privacyPolicy.findByIdAndUpdate(findData._id, Object.assign({}, data));
    }
    async termsConditionListing() {
        const findData = await this.termsConditionM.findOne({}).lean();
        if (!findData) {
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.terms_not_exists);
        }
        return findData;
    }
    async termsConditionUpdate(data) {
        const findData = await this.termsConditionM.findOne({}).lean();
        if (!findData) {
            await this.termsConditionM.create(Object.assign({}, data));
            return;
        }
        await this.termsConditionM.findByIdAndUpdate(findData._id, Object.assign({}, data));
    }
    async appImprovementSuggestion(body) {
        const { page, limit, search, status } = body;
        const model = user_suggestion_improvement_1.default;
        let searchRegex = new RegExp(search, 'i');
        let query = {
            $or: [{ description: searchRegex }],
        };
        if (status != null && status != '') {
            let findStatus = await app_improvement_type_1.default.findOne({ name: status });
            if (findStatus != null) {
                query['app_improve_type_id'] = findStatus._id;
            }
        }
        let allData = await model.paginate(query, {
            page: page,
            limit: limit,
            sort: { timestamp: -1 },
            lean: true,
            populate: [
                {
                    path: 'user_id',
                    select: 'fullname phone_country_code phone_number',
                },
                {
                    path: 'app_improve_type_id',
                    select: '_id name',
                },
            ],
        });
        // @ts-ignore
        allData.docs = allData.docs.map((suggestion) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            return {
                _id: suggestion.id,
                phone_number: (_b = (_a = suggestion === null || suggestion === void 0 ? void 0 : suggestion.user_id) === null || _a === void 0 ? void 0 : _a.phone_number) !== null && _b !== void 0 ? _b : '',
                phone_country_code: (_d = (_c = suggestion === null || suggestion === void 0 ? void 0 : suggestion.user_id) === null || _c === void 0 ? void 0 : _c.phone_country_code) !== null && _d !== void 0 ? _d : '',
                fullname: (_f = (_e = suggestion === null || suggestion === void 0 ? void 0 : suggestion.user_id) === null || _e === void 0 ? void 0 : _e.fullname) !== null && _f !== void 0 ? _f : '',
                app_improvement_suggestion: {
                    id: (_g = suggestion === null || suggestion === void 0 ? void 0 : suggestion.app_improve_type_id) === null || _g === void 0 ? void 0 : _g._id,
                    description: (_h = suggestion.description) !== null && _h !== void 0 ? _h : '',
                    timestamp: suggestion.timestamp,
                    name: (_k = (_j = suggestion === null || suggestion === void 0 ? void 0 : suggestion.app_improve_type_id) === null || _j === void 0 ? void 0 : _j.name) !== null && _k !== void 0 ? _k : '',
                },
            };
        });
        return allData;
    }
    async quickContactListing(body) {
        const { page, limit, search } = body;
        let model = quick_contact_1.default;
        let searchRegex = new RegExp(search, 'i');
        const quickContacts = await model.paginate({
            $or: [{ name: searchRegex }, { email: searchRegex }, { message: searchRegex }],
        }, {
            page: page,
            limit: limit,
            sort: { created_at: -1 },
            lean: true,
        });
        return quickContacts;
    }
    async complaintsListing(body) {
        let complaints;
        let model = complaints_1.default;
        let searchRegex = new RegExp(body.search, 'i');
        let query = {
            $or: [{ reason: searchRegex }, { description: searchRegex }],
        };
        if (body.type == constants_1.COMPLAINT_TYPE.POST) {
            query['user_complain_id'] = null;
        }
        else {
            query['post_complain_id'] = null;
        }
        complaints = await model.paginate(query, {
            page: body.page,
            limit: body.limit,
            lean: true,
            sort: { created_at: -1 },
            populate: {
                path: 'user_id',
                select: 'fullname phone_number',
            },
        });
        for (let i = 0; i < complaints.docs.length; i++) {
            if (complaints.docs[i].user_complain_id != null) {
                complaints.docs[i].user_complain_id = await users_model_1.default.findById(complaints.docs[i].user_complain_id).select('-password').lean();
            }
        }
        return complaints;
    }
    async stockTypeAdd(type, reqData) {
        if (!Object.keys(constants_1.STOCK_TYPE_CONST).includes(type)) {
            throw new HttpException_1.HttpException(404, constants_1.APP_ERROR_MESSAGE.stock_type_invalid);
        }
        if (type === constants_1.STOCK_TYPE_CONST.EQUITY && !reqData.country_code) {
            throw new HttpException_1.HttpException(400, constants_1.APP_ERROR_MESSAGE.country_code_required);
        }
        if (reqData.id == null || reqData.id == '') {
            const stockExists = await stock_types_1.default.findOne({ code: reqData.code });
            if (stockExists) {
                throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.stock_type_code_exists);
            }
            const stockNewData = await stock_types_1.default.create({
                s_type: type,
                code: reqData.code,
                name: reqData.name,
                country_code: reqData.country_code || undefined,
                image: reqData.image || undefined,
            });
            // @ts-ignore
            return stockNewData._doc;
        }
        else {
            const stockNewData = await stock_types_1.default.findByIdAndUpdate(reqData.id, {
                s_type: type,
                code: reqData.code,
                name: reqData.name,
                country_code: reqData.country_code || undefined,
                image: reqData.image || undefined,
            }, { new: true });
            // @ts-ignore
            return stockNewData._doc;
        }
    }
    async stockTypeDelete(type, _id) {
        if (!Object.keys(constants_1.STOCK_TYPE_CONST).includes(type)) {
            throw new HttpException_1.HttpException(404, constants_1.APP_ERROR_MESSAGE.stock_type_invalid);
        }
        // ANCHOR This would be added on, when more models gets associated with Stock.
        await stock_types_1.default.findOneAndDelete({ _id, s_type: type }).exec();
    }
    async saveArticleCategory(request) {
        if (request.id == '0') {
            let checkingSequence = await article_categories_1.default.find({ sequence: request.sequence });
            if (checkingSequence.length == 0) {
                let existing = await article_categories_1.default.find({ name: request.name });
                if (existing.length == 1) {
                    return { status: false, message: "Article category is already exist!" };
                }
                else {
                    let query = {
                        name: request.name,
                        sequence: request.sequence,
                    };
                    await article_categories_1.default.create(query);
                    return { status: true, message: "Article category created successfully!" };
                }
            }
            else {
                return { status: false, message: "Sequence is already exist!" };
            }
        }
        else {
            await article_categories_1.default.findByIdAndUpdate(request.id, {
                name: request.name,
                sequence: request.sequence,
            }, { new: true });
            return { status: true, message: "Article category updated successfully!" };
        }
    }
    async deleteArticleCategory(requestData) {
        if (mongoose_1.default.isValidObjectId(requestData.id)) {
            await article_categories_1.default.findByIdAndRemove(requestData.id, { new: true });
            return true;
        }
        else {
            return false;
        }
    }
    async getArticleCategories() {
        let data = await article_categories_1.default
            .find({ deleted_at: { $eq: null } })
            .sort({ sequence: 1 })
            .lean();
        return data;
    }
    async getArticles(requestData) {
        let model = articles_1.default;
        let searchRegex = new RegExp(requestData.search, 'i');
        let query = { title: searchRegex };
        if (requestData.categoryId != '') {
            query['category'] = requestData.categoryId;
        }
        let data = await model.paginate(query, {
            page: requestData.page,
            limit: requestData.limit,
            sort: { sequence: 1 },
            populate: {
                path: 'category',
            },
        });
        return data;
    }
    async getSingleArticle(requestData) {
        let model = articles_1.default;
        let data = await model.findById(requestData.id);
        return data;
    }
    async deleteUserRating(requestData) {
        if (mongoose_1.default.isValidObjectId(requestData.id)) {
            await user_rates_1.default.findByIdAndRemove(requestData.id, { new: true });
            return true;
        }
        else {
            return false;
        }
    }
    async deleteArticle(requestData) {
        if (mongoose_1.default.isValidObjectId(requestData.id)) {
            await articles_1.default.findByIdAndRemove(requestData.id, { new: true });
            return true;
        }
        else {
            return false;
        }
    }
    async saveArticle(requestData, file) {
        let imageFile;
        if (file) {
            imageFile = await aws_1.default.addAssets(file);
        }
        let query = {
            title: requestData.title,
            category: requestData.category,
            description: requestData.description,
            sequence: requestData.sequence,
            readingTime: requestData.readingTime,
            content: requestData.content,
        };
        console.log(query);
        if (requestData.id == '0') {
            let checkingSequence = await article_categories_1.default.find({ sequence: requestData.sequence });
            if (checkingSequence.length == 0) {
                if (file) {
                    query.coverImage = imageFile != null ? imageFile : '';
                }
                await articles_1.default.create(query);
                return { status: true, message: "Article created successfully!" };
            }
            else {
                return { status: false, message: "Sequence is already existys!" };
            }
        }
        else {
            if (mongoose_1.default.isValidObjectId(requestData.id)) {
                await articles_1.default.findByIdAndUpdate(requestData.id, query);
                return { status: true, message: "Article updated successfully!" };
            }
            else {
                return { status: false, message: "Unable to update article" };
            }
        }
    }
    async stockTypeUpload(type, path) {
        if (!Object.keys(constants_1.STOCK_TYPE_CONST).includes(type)) {
            throw new HttpException_1.HttpException(404, constants_1.APP_ERROR_MESSAGE.stock_type_invalid);
        }
        const fileContent = await fs_1.default.readFileSync(path);
        const csvRecords = (0, sync_1.parse)(fileContent, { columns: true });
        const finalRecords = [];
        await Promise.all(csvRecords.map(async (rec) => {
            const stockExists = await stock_types_1.default.findOne({ code: rec.code });
            if (type === constants_1.STOCK_TYPE_CONST.EQUITY && !rec.country_code) {
                throw new HttpException_1.HttpException(400, constants_1.APP_ERROR_MESSAGE.country_code_required);
            }
            if (stockExists) {
                throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.stock_type_code_exists);
            }
            if (!rec.image) {
                delete rec.image;
            }
            finalRecords.push(Object.assign(Object.assign({}, rec), { s_type: type }));
        }));
        await stock_types_1.default.insertMany(finalRecords);
        (0, util_1.fileUnSyncFromLocalStroage)(path);
    }
    async getAllUserTokens(userIds) {
        let innerQuery = {};
        if (userIds.length > 0) {
            innerQuery['_id'] = {
                $in: userIds,
            };
            innerQuery['allow_notification'] = true;
        }
        else {
            innerQuery['allow_notification'] = true;
        }
        let user = await users_model_1.default.find(innerQuery).select('_id').lean();
        userIds = user.map(a => a._id);
        let query = {
            user_id: {
                $in: userIds,
            },
            revoked: false,
        };
        let userTokens = await device_tokens_1.default.find(query).select('device_token').lean();
        userTokens = userTokens.map((e) => e.device_token);
        userTokens = userTokens.filter((e) => e != null && e != '' && e != undefined);
        return userTokens;
    }
}
exports.default = AdminService;
//# sourceMappingURL=admin.service.js.map