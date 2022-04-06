"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bcrypt_1 = require("bcrypt");
const config_1 = tslib_1.__importDefault(require("config"));
const jsonwebtoken_1 = require("jsonwebtoken");
const date_fns_1 = require("date-fns");
const aws_1 = tslib_1.__importDefault(require("../utils/aws"));
const mongoose_1 = require("mongoose");
const HttpException_1 = require("../exceptions/HttpException");
const users_model_1 = tslib_1.__importDefault(require("../models/users.model"));
const otp_validation_model_1 = tslib_1.__importDefault(require("../models/otp-validation.model"));
const quick_contact_1 = tslib_1.__importDefault(require("../models/quick-contact"));
const user_suggestion_improvement_1 = tslib_1.__importDefault(require("../models/user-suggestion-improvement"));
const util_1 = require("../utils/util");
const constants_1 = require("../utils/constants");
const global_1 = require("../utils/global");
const phone_1 = require("../utils/phone");
const logger_1 = require("../utils/logger");
const app_improvement_type_1 = tslib_1.__importDefault(require("../models/app-improvement-type"));
class AuthService {
    constructor() {
        this.users = users_model_1.default;
        this.otpValidation = otp_validation_model_1.default;
        this.appImprovement = app_improvement_type_1.default;
        this.quickContact = quick_contact_1.default;
        this.userAppSuggestion = user_suggestion_improvement_1.default;
    }
    async validateUserField(userData) {
        const userFound = await this.users.findOne({ [userData.field]: userData.value });
        if (userFound)
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.user_field_exists);
    }
    async verifyPhoneNumber(reqData) {
        const userFound = await this.users.findOne({ phone_number: reqData.phone_number });
        if (userFound)
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.phone_exists);
        // BETA_CODE: For the developer testing we are adding this flag in order to save the sms exhaustion.
        if (reqData.is_testing === 'true') {
            return;
        }
        const phoneNumberExists = await this.otpValidation.findOne({
            phone_number: reqData.phone_number,
            phone_country_code: reqData.phone_country_code,
        });
        // TODO: update the sms sending logic
        if (phoneNumberExists) {
            if ((0, date_fns_1.intervalToDuration)({
                start: (0, date_fns_1.toDate)(phoneNumberExists.created_at),
                end: (0, date_fns_1.toDate)(new Date()),
            }).minutes > 10) {
                logger_1.logger.info(`Phone number OTP changed for: ${reqData.phone_country_code}-${reqData.phone_number}.`);
                await this.otpValidation.findOneAndUpdate({ phone_number: reqData.phone_number, phone_country_code: reqData.phone_country_code }, { otp: (0, phone_1.createPhoneCodeToVerify)() });
            }
            return;
        }
        await this.otpValidation.create({
            phone_number: reqData.phone_number,
            phone_country_code: reqData.phone_country_code,
            otp: (0, phone_1.createPhoneCodeToVerify)(),
        });
    }
    // TODO: This would require bypass verification for testing and Third party integration
    async verifyOtp(reqData) {
        const userFound = await this.users.findOne({ phone_number: reqData.phone_number, phone_country_code: reqData.phone_country_code });
        if (!userFound)
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.user_not_exists);
        if (reqData.otp !== '9999') {
            throw new HttpException_1.HttpException(400, constants_1.APP_ERROR_MESSAGE.otp_invalid);
        }
        return {
            id: userFound._id,
        };
    }
    async signUpPhoneVerify(userData) {
        const hashedPassword = await (0, bcrypt_1.hash)(userData.password, 10);
        const createUserData = await this.users.create(Object.assign(Object.assign({}, userData), { password: hashedPassword, term_agree_timestamp: (0, date_fns_1.toDate)(new Date()) }));
        // @ts-ignore
        const userResFilter = (0, global_1.userResponseFilter)(createUserData._doc);
        return { user: userResFilter };
    }
    async signUpUserVerify(userData) {
        const userAlreadyFullyRegistered = await this.users.findOne({ _id: userData.id, is_registration_complete: true });
        if (userAlreadyFullyRegistered) {
            throw new HttpException_1.HttpException(400, constants_1.APP_ERROR_MESSAGE.user_already_register);
        }
        const userExistsCheckForEmailField = await this.users.findOne({ email: userData.email });
        if (userExistsCheckForEmailField) {
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.email_exists);
        }
        const userExistsCheckForUsernameField = await this.users.findOne({ username: userData.username });
        if (userExistsCheckForUsernameField) {
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.username_exists);
        }
        const updateUserData = await this.users.findByIdAndUpdate(userData.id, {
            email: userData.email,
            username: userData.username,
            fullname: userData.fullname,
            birth_date: userData.birth_date,
            trading_exp: userData.trading_exp,
            gender: userData.gender,
            is_registration_complete: true,
        }, { new: true });
        if (!updateUserData) {
            throw new HttpException_1.HttpException(400, constants_1.APP_ERROR_MESSAGE.user_id_not_exits);
        }
        const token_data = this.createToken(updateUserData);
        const cookie = this.createCookie(token_data);
        // @ts-ignore
        const userResFilter = (0, global_1.userResponseFilter)(updateUserData._doc);
        return { cookie, token_data, user: userResFilter };
    }
    async login(userData) {
        const findUser = await this.users.findOne({ phone_number: userData.phone_number }).lean();
        if (!findUser)
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.user_not_exists);
        if (!findUser.is_registration_complete) {
            throw new HttpException_1.HttpException(451, constants_1.APP_ERROR_MESSAGE.user_not_complete_register, { id: findUser._id });
        }
        const isPasswordMatching = await (0, bcrypt_1.compare)(userData.password, findUser.password);
        if (!isPasswordMatching)
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.incorrect_password);
        /* IF User is admin we won't allow them to login in the mobile application */
        if (findUser.role === constants_1.USER_ROLE.ADMIN) {
            throw new HttpException_1.HttpException(403, constants_1.APP_ERROR_MESSAGE.forbidden_error);
        }
        // @ts-ignore
        if (findUser.deleted_at) {
            throw new HttpException_1.HttpException(401, constants_1.APP_ERROR_MESSAGE.user_blocked);
        }
        const token_data = this.createToken(findUser);
        const cookie = this.createCookie(token_data);
        const userResFilter = (0, global_1.userResponseFilter)(findUser);
        return { cookie, token_data, user: userResFilter };
    }
    async forgotPassword(reqData) {
        const userFound = await this.users.findOne({ phone_number: reqData.phone_number, phone_country_code: reqData.phone_country_code });
        if (!userFound)
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.user_not_exists);
        // BETA_CODE: For the developer testing we are adding this flag in order to save the sms exhaustion.
        if (reqData.is_testing === 'true') {
            return;
        }
    }
    async resetPassword(reqData) {
        const userFound = await this.users.findOne({ _id: reqData.id });
        if (!userFound)
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.user_not_exists);
        const hashedPassword = await (0, bcrypt_1.hash)(reqData.password, 10);
        await this.users.findByIdAndUpdate(reqData.id, { password: hashedPassword }, { new: true });
    }
    async changePassword(userData, id) {
        const findUser = await this.users.findOne({ _id: id }).lean();
        if (!findUser)
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.user_not_exists);
        const isPasswordMatching = await (0, bcrypt_1.compare)(userData.password, findUser.password);
        if (!isPasswordMatching)
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.incorrect_password);
        const hashedPassword = await (0, bcrypt_1.hash)(userData.new_password, 10);
        await this.users.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
    }
    async profile(id) {
        const findUser = await this.users.findOne({ _id: id }).lean();
        const userResFilter = (0, global_1.userResponseFilter)(findUser);
        return { user: userResFilter };
    }
    async editProfile(userData, file, id) {
        var _a;
        const userExistsCheckForEmailField = await this.users.findOne({ _id: { $ne: id }, email: userData.email });
        if (userExistsCheckForEmailField) {
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.email_exists);
        }
        const userExistsCheckForUsernameField = await this.users.findOne({ _id: { $ne: id }, username: userData.username });
        if (userExistsCheckForUsernameField) {
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.username_exists);
        }
        const payload = {
            email: userData.email,
            username: userData.username,
            fullname: userData.fullname,
            birth_date: userData.birth_date,
            trading_exp: userData.trading_exp,
            gender: userData.gender,
            bio: (_a = userData.bio) !== null && _a !== void 0 ? _a : null,
            youtube_link: userData.youtube_link,
            instagram_link: userData.instagram_link,
            telegram_link: userData.telegram_link,
        };
        if (file) {
            const profileUser = await this.users.findOne({ _id: id });
            // Delete the existing image from S3
            if (profileUser.profile_photo) {
                aws_1.default.deleteProfileImage(profileUser.profile_photo);
            }
            // Add image
            const profileImage = await aws_1.default.addProfileImage(file);
            payload.profile_photo = profileImage;
        }
        await this.users.findByIdAndUpdate(id, payload, { new: true });
        return await this.profile(id);
    }
    async changePhoneNumber(userData, id) {
        const findUser = await this.users.findOne({ _id: id }).lean();
        if (!findUser)
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.user_not_exists);
        await this.users.findByIdAndUpdate(id, { phone_country_code: userData.phone_country_code, phone_number: userData.phone_number }, { new: true });
        return await this.profile(id);
    }
    async notificationUpdate(userData, id) {
        const findUser = await this.users.findOne({ _id: id }).lean();
        if (!findUser)
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.user_not_exists);
        // TODO: Needs to be updated once mobile change are fixed
        await this.users.findByIdAndUpdate(id, { allow_notification: userData.allow_notification === 'true' }, { new: true });
        return await this.profile(id);
    }
    async logout(userData) {
        if ((0, util_1.isEmpty)(userData))
            throw new HttpException_1.HttpException(400, "You're not userData");
        const findUser = await this.users.findOne({ email: userData.email, password: userData.password });
        if (!findUser)
            throw new HttpException_1.HttpException(409, `You're email ${userData.email} not found`);
    }
    async appImprovementTypes() {
        const result = await mongoose_1.connection.collection(constants_1.APP_IMPROVEMENT_TYPES).find({}).toArray();
        return [...result];
    }
    async getUserAppImprovementSuggestion(id) {
        const appSuggestion = await this.userAppSuggestion.find({ user_id: id }).populate('app_improve_type_id').populate('user_id', ['_id', 'fullname']);
        return {
            // @ts-ignore
            app_improvement_suggestion: appSuggestion,
        };
    }
    async updateUserAppImprovementSuggestion(reqData, id) {
        var _a;
        await this.userAppSuggestion.create({ description: (_a = reqData === null || reqData === void 0 ? void 0 : reqData.description) !== null && _a !== void 0 ? _a : '', user_id: id, app_improve_type_id: reqData.id });
    }
    async addQuickContact(reqData) {
        const newContact = await this.quickContact.create(Object.assign({}, reqData));
        // @ts-ignore
        return newContact;
    }
    createToken(user) {
        const dataStoredInToken = { _id: user._id, role: user.role };
        const secretKey = config_1.default.get('secretKey');
        const expiresIn = config_1.default.get('tokenExpiry');
        const token = (0, jsonwebtoken_1.sign)(dataStoredInToken, secretKey, { expiresIn });
        return { expires_in: expiresIn, token };
    }
    createCookie(tokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expires_in};`;
    }
}
exports.default = AuthService;
//# sourceMappingURL=auth.service.js.map