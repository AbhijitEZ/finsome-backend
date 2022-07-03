"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const config_1 = tslib_1.__importDefault(require("config"));
const jsonwebtoken_1 = require("jsonwebtoken");
const bcrypt_1 = require("bcrypt");
const HttpException_1 = require("../../exceptions/HttpException");
const constants_1 = require("../../utils/constants");
const users_model_1 = tslib_1.__importDefault(require("../../models/users.model"));
const app_improvement_type_1 = tslib_1.__importDefault(require("../../models/app-improvement-type"));
const util_1 = require("../../utils/util");
const date_fns_1 = require("date-fns");
const quick_contact_1 = tslib_1.__importDefault(require("../../models/quick-contact"));
const user_suggestion_improvement_1 = tslib_1.__importDefault(require("../../models/user-suggestion-improvement"));
const privacy_policy_1 = tslib_1.__importDefault(require("../../models/privacy-policy"));
const complaints_1 = tslib_1.__importDefault(require("../../models/complaints"));
const terms_condition_1 = tslib_1.__importDefault(require("../../models/terms-condition"));
const stock_types_1 = tslib_1.__importDefault(require("../../models/stock-types"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const sync_1 = require("csv-parse/sync");
const posts_1 = tslib_1.__importDefault(require("../../models/posts"));
class AdminService {
    constructor() {
        this.users = users_model_1.default;
        this.appImprovement = app_improvement_type_1.default;
        this.quickContact = quick_contact_1.default;
        this.userSuggestion = user_suggestion_improvement_1.default;
        this.privacyPolicy = privacy_policy_1.default;
        this.termsConditionM = terms_condition_1.default;
        this.complaintM = complaints_1.default;
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
    async userListing(user) {
        const users = await this.users
            .find({
            _id: { $ne: user._id },
            role: { $ne: constants_1.USER_ROLE.ADMIN },
        })
            .sort({ created_at: -1 })
            .select(['-password', '-updated_at', '-term_agree_timestamp'])
            .lean();
        const userSanitized = users.map(user => (Object.assign(Object.assign({}, user), { profile_photo: (0, util_1.profileImageGenerator)(user.profile_photo) })));
        return userSanitized;
    }
    async dashboardData(user) {
        const users = await this.users
            .find({
            _id: { $ne: user._id },
            role: { $ne: constants_1.USER_ROLE.ADMIN },
        })
            .sort({ created_at: -1 })
            .lean();
        const appImproves = await this.appImprovement.find({});
        const quickContacts = await this.quickContact.find({});
        const suggestions = await this.userSuggestion.find({});
        const posts = await posts_1.default.find({});
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
            app_improves: appImproves.length,
            quick_contacts: quickContacts.length,
            suggestions: suggestions.length,
            posts: posts.length,
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
    async appImprovementSuggestion() {
        let allSuggestion = await this.userSuggestion
            .find({})
            .populate('user_id', ['fullname', 'phone_number'])
            .sort({ timestamp: -1 })
            .populate('app_improve_type_id', ['_id', 'name']);
        // @ts-ignore
        allSuggestion = allSuggestion.map((suggestion) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return {
                _id: suggestion.id,
                phone_number: (_b = (_a = suggestion === null || suggestion === void 0 ? void 0 : suggestion.user_id) === null || _a === void 0 ? void 0 : _a.phone_number) !== null && _b !== void 0 ? _b : '',
                fullname: (_d = (_c = suggestion === null || suggestion === void 0 ? void 0 : suggestion.user_id) === null || _c === void 0 ? void 0 : _c.fullname) !== null && _d !== void 0 ? _d : '',
                app_improvement_suggestion: {
                    id: (_e = suggestion === null || suggestion === void 0 ? void 0 : suggestion.app_improve_type_id) === null || _e === void 0 ? void 0 : _e._id,
                    description: (_f = suggestion.description) !== null && _f !== void 0 ? _f : '',
                    timestamp: suggestion.timestamp,
                    name: (_h = (_g = suggestion === null || suggestion === void 0 ? void 0 : suggestion.app_improve_type_id) === null || _g === void 0 ? void 0 : _g.name) !== null && _h !== void 0 ? _h : '',
                },
            };
        });
        return allSuggestion;
    }
    async quickContactListing() {
        const quickContacts = await this.quickContact.find({}).sort({ created_at: -1 }).lean();
        return quickContacts;
    }
    async complaintsListing(type) {
        let complaints = [];
        if (type === constants_1.COMPLAINT_TYPE.POST) {
            complaints = await this.complaintM
                .find({
                user_complain_id: null,
            })
                .populate('user_id', ['fullname', 'phone_number'])
                .sort({ created_at: -1 })
                .lean();
        }
        else {
            complaints = await this.complaintM
                .find({
                post_complain_id: null,
            })
                .populate('user_id', ['fullname', 'phone_number'])
                .sort({ created_at: -1 })
                .lean();
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
    async stockTypeDelete(type, _id) {
        if (!Object.keys(constants_1.STOCK_TYPE_CONST).includes(type)) {
            throw new HttpException_1.HttpException(404, constants_1.APP_ERROR_MESSAGE.stock_type_invalid);
        }
        // ANCHOR This would be added on, when more models gets associated with Stock.
        await stock_types_1.default.findOneAndDelete({ _id, s_type: type }).exec();
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
}
exports.default = AdminService;
//# sourceMappingURL=admin.service.js.map