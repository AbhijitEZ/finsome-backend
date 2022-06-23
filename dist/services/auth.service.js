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
const notifications_1 = tslib_1.__importDefault(require("../models/notifications"));
const user_rates_1 = tslib_1.__importDefault(require("../models/user-rates"));
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
    async userNotfication(userId, queryData) {
        var _a, _b;
        const notificationsData = await notifications_1.default.aggregate([
            {
                $match: {
                    user_id: userId,
                    deleted_at: {
                        $eq: null,
                    },
                },
            },
            {
                $addFields: {
                    created_at_tz: { $dateToString: { date: '$created_at', timezone: constants_1.DEFAULT_TIMEZONE, format: '%Y-%m-%dT%H:%M:%S.%LZ' } },
                },
            },
            {
                $sort: {
                    created_at: -1,
                },
            },
            {
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
            },
        ]);
        const data = (0, util_1.listingResponseSanitize)(notificationsData);
        // @ts-ignore
        return data;
    }
    async addQuickContact(reqData) {
        const newContact = await this.quickContact.create(Object.assign({}, reqData));
        // @ts-ignore
        return newContact;
    }
    async followerRequest(userId, fullname, profilePhoto, reqData) {
        const followerReqExists = await this.userFollowerM.findOne({
            user_id: reqData.following_id,
            follower_id: userId,
        });
        if (followerReqExists) {
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.follower_exists);
        }
        const followingUserDetail = await user_configurations_1.default
            .findOne({
            user_id: reqData.following_id,
        })
            .lean();
        const acceptedState = (followingUserDetail === null || followingUserDetail === void 0 ? void 0 : followingUserDetail.account_type) === constants_1.ACCOUNT_TYPE_CONST.PRIVATE ? constants_1.ACCOUNT_TYPE_CONST.PRIVATE : constants_1.ACCOUNT_TYPE_CONST.PUBLIC;
        const newFollower = await this.userFollowerM.create({
            follower_id: userId,
            user_id: reqData.following_id,
            accepted: (followingUserDetail === null || followingUserDetail === void 0 ? void 0 : followingUserDetail.account_type) === constants_1.ACCOUNT_TYPE_CONST.PRIVATE ? false : true,
        });
        if (acceptedState === constants_1.ACCOUNT_TYPE_CONST.PUBLIC) {
            notifications_1.default.create({
                user_id: reqData.following_id,
                message: `${fullname || 'User'} has requested to follow you`,
                meta_data: {
                    follow: newFollower._id,
                    user_id: userId,
                    profile_photo: (0, util_1.profileImageGenerator)(profilePhoto),
                },
            });
        }
        // @ts-ignore
        return newFollower;
    }
    async followAcceptRequest(userId, fullname, profilephoto, followId) {
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
        notifications_1.default.create({
            user_id: followReqExists === null || followReqExists === void 0 ? void 0 : followReqExists.follower_id,
            message: `${fullname || 'User'} has accepted your follow request`,
            type: constants_1.NOTIFICATION_TYPE_CONST.FOLLOW_ACCEPT,
            meta_data: {
                follow: followId,
                user_id: userId,
                profile_photo: (0, util_1.profileImageGenerator)(profilephoto),
            },
        });
        return {
            accepted: true,
        };
    }
    async followDeleteRequest(userId, followId) {
        const followReqExists = await this.userFollowerM.findOne({
            _id: followId,
        });
        if (!followReqExists) {
            throw new HttpException_1.HttpException(400, constants_1.APP_ERROR_MESSAGE.follower_exists);
        }
        await this.userFollowerM.findByIdAndDelete(followReqExists._id);
        return {
            accepted: false,
        };
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
                    is_registration_complete: true,
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
                            $match: {
                                follower_id: new mongoose_1.Types.ObjectId(userId),
                            },
                        },
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
                            $match: {
                                user_id: new mongoose_1.Types.ObjectId(userId),
                            },
                        },
                        {
                            $unset: ['follower_id', 'user_id', 'created_at', 'updated_at', 'deleted_at'],
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: constants_1.USER_RATES,
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'user_rates',
                    pipeline: [
                        {
                            $group: {
                                _id: '$user_id',
                                avg: { $avg: '$rate' },
                            },
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
            {
                $unwind: {
                    path: '$user_rates',
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
    async userDetail(userId, detailId) {
        var _a, _b;
        const usersqb = this.users.aggregate([
            {
                $match: {
                    _id: {
                        $eq: new mongoose_1.Types.ObjectId(detailId),
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
                    from: constants_1.USER_CONFIGURATIONS,
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'user_configuration',
                    pipeline: [
                        {
                            $project: {
                                account_type: 1,
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: constants_1.POSTS,
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'posts',
                    pipeline: [
                        {
                            $match: {
                                deleted_at: {
                                    $eq: null,
                                },
                            },
                        },
                        {
                            $count: 'post_total_count',
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: constants_1.USER_FOLLOWERS,
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'following',
                    pipeline: [
                        {
                            $match: {
                                follower_id: new mongoose_1.Types.ObjectId(userId),
                            },
                        },
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
                    foreignField: 'user_id',
                    as: 'following_count',
                    pipeline: [
                        {
                            $unset: ['follower_id', 'user_id', 'created_at', 'updated_at', 'deleted_at'],
                        },
                        {
                            $count: 'total_following',
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
                            $match: {
                                user_id: new mongoose_1.Types.ObjectId(userId),
                            },
                        },
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
                    as: 'follower_count',
                    pipeline: [
                        {
                            $unset: ['follower_id', 'user_id', 'created_at', 'updated_at', 'deleted_at'],
                        },
                        {
                            $count: 'total_follower',
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: '$user_configuration',
                    preserveNullAndEmptyArrays: true,
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
            {
                $unwind: {
                    path: '$following_count',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: '$follower_count',
                    preserveNullAndEmptyArrays: true,
                },
            },
            { $sort: { created_at: -1 } },
        ]);
        usersqb.append({
            $facet: {
                totalRecords: [
                    {
                        $count: 'total',
                    },
                ],
                result: [
                    {
                        $skip: 0,
                    },
                    {
                        $limit: 1,
                    },
                ],
            },
        });
        const usersData = await usersqb.exec();
        const { result } = (0, util_1.listingResponseSanitize)(usersData);
        return { user: (_b = (_a = result.map(user => (Object.assign(Object.assign({}, user), { profile_photo: (0, util_1.profileImageGenerator)(user.profile_photo) })))) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : {} };
    }
    async userRating(userId, userRateId, reqData) {
        const userRateExists = await this.users.findOne({
            _id: userRateId,
        });
        if (!userRateExists) {
            throw new HttpException_1.HttpException(400, constants_1.APP_ERROR_MESSAGE.user_id_not_exits);
        }
        const userRatingExists = await user_rates_1.default.findOne({
            deleted_at: {
                $eq: null,
            },
            user_id: userRateId,
            rated_by_user: userId,
        });
        if (userRatingExists) {
            const currentUserRatingData = await user_rates_1.default.findByIdAndUpdate(userRatingExists._id, {
                rate: reqData.rate,
                comment: reqData.comment,
            }, { new: true });
            // @ts-ignore
            return currentUserRatingData._doc;
        }
        const newUserRateData = await user_rates_1.default.create({
            user_id: userRateId,
            rated_by_user: userId,
            rate: reqData.rate,
            comment: reqData.comment,
        });
        // @ts-ignore
        return newUserRateData._doc;
    }
    async userListingRate(_, reqData, userId) {
        var _a, _b;
        let userRatings = user_rates_1.default.aggregate([
            {
                $match: {
                    deleted_at: {
                        $eq: null,
                    },
                    user_id: new mongoose_1.Types.ObjectId(userId),
                },
            },
            {
                $addFields: {
                    updated_at_tz: { $dateToString: { date: '$updated_at', timezone: constants_1.DEFAULT_TIMEZONE, format: '%Y-%m-%dT%H:%M:%S.%LZ' } },
                },
            },
            {
                $lookup: {
                    from: constants_1.USERS,
                    localField: 'rated_by_user',
                    foreignField: '_id',
                    as: 'user_detail',
                    pipeline: [
                        {
                            $project: {
                                fullname: 1,
                                profile_photo: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: '$user_detail',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $sort: { updated_at: -1 },
            },
            {
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
            },
        ]);
        userRatings = await userRatings.exec();
        const data = (0, util_1.listingResponseSanitize)(userRatings);
        return data;
    }
    async userRateDetails(userId, userRateId) {
        const userRateExists = await this.users.findOne({
            _id: userRateId,
        });
        if (!userRateExists) {
            throw new HttpException_1.HttpException(400, constants_1.APP_ERROR_MESSAGE.user_id_not_exits);
        }
        const userRatingExists = await user_rates_1.default.findOne({
            deleted_at: {
                $eq: null,
            },
            user_id: userRateId,
            rated_by_user: userId,
        });
        // @ts-ignore
        return userRatingExists._doc;
    }
    async userRateRemove(userId, userRateId) {
        const userRateExists = await this.users.findOne({
            _id: userRateId,
        });
        if (!userRateExists) {
            throw new HttpException_1.HttpException(400, constants_1.APP_ERROR_MESSAGE.user_id_not_exits);
        }
        const userRatingExists = await user_rates_1.default.findOne({
            deleted_at: {
                $eq: null,
            },
            user_id: userRateId,
            rated_by_user: userId,
        });
        await user_rates_1.default.findByIdAndDelete(userRatingExists._id);
        // @ts-ignore
        return {};
    }
    // NOTE: find better optimal solution
    async userRatingStatistics(userId) {
        const userRateAvg = await user_rates_1.default.aggregate([
            {
                $match: {
                    user_id: new mongoose_1.Types.ObjectId(userId),
                    deleted_at: { $eq: null },
                },
            },
        ]);
        let overall_avg = 0;
        let no_rating_1 = 0;
        let no_rating_2 = 0;
        let no_rating_3 = 0;
        let no_rating_4 = 0;
        let no_rating_5 = 0;
        userRateAvg.forEach(userPerRate => {
            if (userPerRate.rate) {
                overall_avg += userPerRate.rate;
            }
            if ((userPerRate === null || userPerRate === void 0 ? void 0 : userPerRate.rate) < 2) {
                no_rating_1 += 1;
            }
            if ((userPerRate === null || userPerRate === void 0 ? void 0 : userPerRate.rate) >= 2 && (userPerRate === null || userPerRate === void 0 ? void 0 : userPerRate.rate) < 3) {
                no_rating_2 += 1;
            }
            if ((userPerRate === null || userPerRate === void 0 ? void 0 : userPerRate.rate) >= 3 && (userPerRate === null || userPerRate === void 0 ? void 0 : userPerRate.rate) < 4) {
                no_rating_3 += 1;
            }
            if ((userPerRate === null || userPerRate === void 0 ? void 0 : userPerRate.rate) >= 4 && (userPerRate === null || userPerRate === void 0 ? void 0 : userPerRate.rate) < 5) {
                no_rating_4 += 1;
            }
            if ((userPerRate === null || userPerRate === void 0 ? void 0 : userPerRate.rate) >= 5) {
                no_rating_5 += 1;
            }
        });
        const total_no_user_rating = userRateAvg.length;
        overall_avg = total_no_user_rating ? parseFloat((overall_avg / total_no_user_rating).toFixed(2)) : 0;
        return {
            overall_avg,
            no_rating_1,
            no_rating_2,
            no_rating_3,
            no_rating_4,
            no_rating_5,
            total_no_user_rating,
        };
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