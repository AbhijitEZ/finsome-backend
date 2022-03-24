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
const mongoose_1 = require("mongoose");
const ObjectId = require('mongodb').ObjectID;
const util_1 = require("../utils/util");
const date_fns_1 = require("date-fns");
class AdminService {
    constructor() {
        this.users = users_model_1.default;
        this.appImprovement = app_improvement_type_1.default;
    }
    async adminLogin(loginDto) {
        const adminUser = await this.users.findOne({
            email: loginDto.email,
            role: constants_1.USER_ROLE.ADMIN,
        });
        if (!adminUser) {
            throw new HttpException_1.HttpException(400, constants_1.APP_ERROR_MESSAGE.user_not_exists);
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
            .select(['-password', '-updated_at', '-term_agree_timestamp'])
            .lean();
        const userSanitized = users.map(user => (Object.assign(Object.assign({}, user), { profile_photo: (0, util_1.profileImageGenerator)(user.profile_photo) })));
        return userSanitized;
    }
    async toggleUserStatus(user) {
        const findUser = await this.users.findOne({ _id: user.id }).lean();
        if (!findUser)
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.user_not_exists);
        await this.users.findByIdAndUpdate(user.id, { deleted_at: user.status ? (0, date_fns_1.toDate)(new Date()) : null }, { new: true });
    }
    async appImprovementSuggestion() {
        const users = await this.users
            .find({
            role: { $ne: constants_1.USER_ROLE.ADMIN },
            app_improvement_suggestion: { $nin: [null] },
        })
            .select([
            'fullname',
            'phone_number',
            'app_improvement_suggestion.id',
            'app_improvement_suggestion.timestamp',
            'app_improvement_suggestion.description',
        ])
            .sort({ 'app_improvement_suggestion.timestamp': -1 })
            .lean();
        const sanitizedDate = await Promise.all(users.map(async (user) => {
            const appImprovData = await mongoose_1.connection.collection(constants_1.APP_IMPROVEMENT_TYPES).findOne({ _id: new ObjectId(user.app_improvement_suggestion.id) });
            return Object.assign(Object.assign({}, user), { app_improvement_suggestion: Object.assign(Object.assign({}, user.app_improvement_suggestion), { name: appImprovData.name }) });
        }));
        return sanitizedDate;
    }
}
exports.default = AdminService;
//# sourceMappingURL=admin.service.js.map