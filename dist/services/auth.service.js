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
const user_configurations_1 = tslib_1.__importDefault(require("../models/user-configurations"));
const user_followers_1 = tslib_1.__importDefault(require("../models/user-followers"));
class AuthService {
    constructor() {
        this.users = users_model_1.default;
        this.otpValidation = otp_validation_model_1.default;
        this.appImprovement = app_improvement_type_1.default;
        this.quickContact = quick_contact_1.default;
        this.userAppSuggestion = user_suggestion_improvement_1.default;
        this.userFollowerM = user_followers_1.default;
        this.updateUserCodeWithSMS = async (reqData, existCode, type) => {
            const code = existCode ? existCode : (0, phone_1.createPhoneCodeToVerify)();
            logger_1.logger.info(`Phone number OTP for: ${reqData.phone_country_code}-${reqData.phone_number}.`);
            // TODO: Would be uncommented in future
            // checkPhoneNumberCountryCodeForSMSCalling({
            //   countryCode: reqData.phone_country_code,
            //   phoneNumber: reqData.phone_number,
            //   codeData: { code },
            // });
            if (!type) {
                await this.otpValidation.findOneAndUpdate({ phone_number: reqData.phone_number, phone_country_code: reqData.phone_country_code }, { otp: code });
            }
            else if (type === 'user') {
                await this.users.findOneAndUpdate({ phone_number: reqData.phone_number, phone_country_code: reqData.phone_country_code }, { otp: code });
            }
        };
        this.asyncUserCreationProcess = async (id) => {
            const configExists = await user_configurations_1.default.findOne({ user_id: id });
            if (!configExists) {
                user_configurations_1.default.create({ user_id: id, account_type: constants_1.ACCOUNT_TYPE_CONST.PUBLIC });
            }
        };
    }
    async validateUserField(userData) {
        const userFound = await this.users.findOne({ [userData.field]: userData.value });
        if (userFound)
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.user_field_exists);
    }
    async verifyPhoneNumberWithOTP(reqData, userData) {
        const userFound = await this.users.findOne({ phone_number: reqData.phone_number });
        if (userFound)
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.phone_exists);
        // For Change Phone number require userData
        if (userData) {
            // BETA_CODE: For the developer testing we are adding this flag in order to save the sms exhaustion.
            if (reqData.is_testing === 'true') {
                return;
            }
            if ((0, phone_1.intervalDurationOTPCheck)(userData.updated_at)) {
                this.updateUserCodeWithSMS(reqData, undefined, 'user');
            }
            else {
                this.updateUserCodeWithSMS(reqData, userData.otp, 'user');
            }
            return;
        }
        else {
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
                console.log('EXSITING OTP VALIDAION');
                if ((0, phone_1.intervalDurationOTPCheck)(phoneNumberExists.updated_at)) {
                    this.updateUserCodeWithSMS(reqData);
                }
                else {
                    this.updateUserCodeWithSMS(reqData, phoneNumberExists.otp);
                }
                return;
            }
            console.log('NEW OTP VALIDAION');
            const code = (0, phone_1.createPhoneCodeToVerify)();
            logger_1.logger.info(`Phone number OTP changed for first time: ${reqData.phone_country_code}-${reqData.phone_number}.`);
            // TODO: Would be uncommented in future
            // checkPhoneNumberCountryCodeForSMSCalling({
            //   countryCode: reqData.phone_country_code,
            //   phoneNumber: reqData.phone_number,
            //   codeData: { code },
            // });
            await this.otpValidation.create({
                phone_number: reqData.phone_number,
                phone_country_code: reqData.phone_country_code,
                otp: code,
            });
        }
    }
    async signUpPhoneVerify(userData) {
        const userPhoneCheck = await this.otpValidation.findOne({
            phone_number: userData.phone_number,
            phone_country_code: userData.phone_country_code,
        });
        // TODO: Would be removed in future.
        if (!userPhoneCheck && userData.otp !== '9999') {
            throw new HttpException_1.HttpException(400, constants_1.APP_ERROR_MESSAGE.otp_invalid);
        }
        // TODO: Would be removed in future for testing part.
        if (userPhoneCheck && userData.otp !== '9999' && userData.otp !== userPhoneCheck.otp) {
            throw new HttpException_1.HttpException(400, constants_1.APP_ERROR_MESSAGE.otp_invalid);
        }
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
        this.asyncUserCreationProcess(updateUserData._id);
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
            throw new HttpException_1.HttpException(400, constants_1.APP_ERROR_MESSAGE.user_blocked);
        }
        this.asyncUserCreationProcess(findUser._id);
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
        if ((0, phone_1.intervalDurationOTPCheck)(userFound.updated_at)) {
            this.updateUserCodeWithSMS(reqData, undefined, 'user');
        }
        else {
            this.updateUserCodeWithSMS(reqData, userFound.otp, 'user');
        }
    }
    async verifyOtp(reqData) {
        const userFound = await this.users.findOne({ phone_number: reqData.phone_number, phone_country_code: reqData.phone_country_code });
        if (!userFound)
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.user_not_exists);
        // TODO: Would be removed in production in future.
        if (reqData.otp !== '9999' && userFound.otp !== reqData.otp) {
            throw new HttpException_1.HttpException(400, constants_1.APP_ERROR_MESSAGE.otp_invalid);
        }
        return {
            id: userFound._id,
        };
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
        const profileUser = await this.users.findOne({ _id: id });
        if (file) {
            // Delete the existing image from S3
            if (profileUser.profile_photo) {
                aws_1.default.deleteProfileImage(profileUser.profile_photo);
            }
            // Add image
            const profileImage = await aws_1.default.addAssets(file);
            payload.profile_photo = profileImage;
        }
        if (userData.remove_photo && (profileUser === null || profileUser === void 0 ? void 0 : profileUser.profile_photo)) {
            aws_1.default.deleteProfileImage(profileUser.profile_photo);
            payload.profile_photo = null;
        }
        await this.users.findByIdAndUpdate(id, payload, { new: true });
        return await this.profile(id);
    }
    async changePhoneNumber(userData, id) {
        const findUser = await this.users.findOne({ _id: id }).lean();
        if (!findUser)
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.user_not_exists);
        // TODO: Would have actual OTP check after client confirmation
        if (userData.otp !== '9999' && userData.otp !== findUser.otp) {
            throw new HttpException_1.HttpException(400, constants_1.APP_ERROR_MESSAGE.otp_invalid);
        }
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
    async followerRequest(userId, reqData) {
        const followerReqExists = await this.userFollowerM.findOne({
            user_id: reqData.following_id,
            follower_id: userId,
        });
        if (followerReqExists) {
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.follower_exists);
        }
        const newFollower = await this.userFollowerM.create({ follower_id: userId, user_id: reqData.following_id });
        // @ts-ignore
        return newFollower;
    }
    async followAcceptRequest(userId, followId) {
        const followReqExists = await this.userFollowerM.findOne({
            _id: followId,
            user_id: userId,
            accepted: false,
        });
        if (!followReqExists) {
            throw new HttpException_1.HttpException(400, constants_1.APP_ERROR_MESSAGE.follower_exists);
        }
        await this.userFollowerM.findByIdAndUpdate(followReqExists._id, {
            accepted: true,
        });
        return followReqExists;
    }
    async userListing(userId, reqData) {
        var _a, _b;
        const usersqb = this.users.aggregate([
            {
                $match: {
                    _id: {
                        $ne: userId,
                    },
                    deleted_at: { $eq: null },
                    role: { $eq: constants_1.USER_ROLE.MEMBER },
                },
            },
            {
                $addFields: {
                    created_at_tz: { $dateToString: { date: '$created_at', timezone: constants_1.DEFAULT_TIMEZONE, format: '%Y-%m-%dT%H:%M:%S.%LZ' } },
                },
            },
            {
                $unset: ['password'],
            },
            {
                $lookup: {
                    from: constants_1.USER_FOLLOWERS,
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'following',
                    pipeline: [
                        {
                            $unset: ['follower_id', 'user_id', 'created_at', 'updated_at', 'deleted_at'],
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: constants_1.USER_FOLLOWERS,
                    localField: '_id',
                    foreignField: 'follower_id',
                    as: 'follower',
                    pipeline: [
                        {
                            $unset: ['follower_id', 'user_id', 'created_at', 'updated_at', 'deleted_at'],
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: '$following',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: '$follower',
                    preserveNullAndEmptyArrays: true,
                },
            },
            { $sort: { created_at: -1 } },
        ]);
        if (reqData.search) {
            usersqb.append({
                $match: {
                    // TODO: to have email and username added in the search checking
                    fullname: new RegExp(reqData.search, 'i'),
                },
            });
        }
        usersqb.append({
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
        const usersData = await usersqb.exec();
        const { total_count, result } = (0, util_1.listingResponseSanitize)(usersData);
        return { total_count, users: result.map(user => (Object.assign(Object.assign({}, user), { profile_photo: (0, util_1.profileImageGenerator)(user.profile_photo) }))) };
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