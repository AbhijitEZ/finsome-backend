"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bcrypt_1 = require("bcrypt");
const config_1 = tslib_1.__importDefault(require("config"));
const jsonwebtoken_1 = require("jsonwebtoken");
const date_fns_1 = require("date-fns");
const aws_1 = tslib_1.__importDefault(require("../utils/aws"));
const HttpException_1 = require("../exceptions/HttpException");
const users_model_1 = tslib_1.__importDefault(require("../models/users.model"));
const util_1 = require("../utils/util");
const constants_1 = require("../utils/constants");
class AuthService {
    constructor() {
        this.users = users_model_1.default;
    }
    async validateUserField(userData) {
        const userFound = await this.users.findOne({ [userData.field]: userData.value });
        if (userFound)
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.user_field_exists);
    }
    async signUpPhoneVerify(userData) {
        const hashedPassword = await (0, bcrypt_1.hash)(userData.password, 10);
        const createUserData = await this.users.create(Object.assign(Object.assign({}, userData), { password: hashedPassword, term_agree_timestamp: (0, date_fns_1.toDate)(new Date()) }));
        // @ts-ignore
        const userResponseFilter = this.userResponseFilter(createUserData._doc);
        return { user: userResponseFilter };
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
        const userResponseFilter = this.userResponseFilter(updateUserData._doc);
        return { cookie, token_data, user: userResponseFilter };
    }
    async login(userData) {
        const findUser = await this.users.findOne({ phone_number: userData.phone_number }).lean();
        if (!findUser)
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.user_not_exists);
        if (!findUser.is_registration_complete) {
            throw new HttpException_1.HttpException(412, constants_1.APP_ERROR_MESSAGE.user_not_complete_register, { id: findUser._id });
        }
        const isPasswordMatching = await (0, bcrypt_1.compare)(userData.password, findUser.password);
        if (!isPasswordMatching)
            throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.incorrect_password);
        /* IF User is admin we won't allow them to login in the mobile application */
        if (findUser.role === constants_1.USER_ROLE.ADMIN) {
            throw new HttpException_1.HttpException(403, constants_1.APP_ERROR_MESSAGE.forbidden_error);
        }
        const token_data = this.createToken(findUser);
        const cookie = this.createCookie(token_data);
        const userResponseFilter = this.userResponseFilter(findUser);
        return { cookie, token_data, user: userResponseFilter };
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
        const userResponseFilter = this.userResponseFilter(findUser);
        return { user: userResponseFilter };
    }
    async editProfile(userData, file, id) {
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
            bio: userData.bio,
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
    }
    async logout(userData) {
        if ((0, util_1.isEmpty)(userData))
            throw new HttpException_1.HttpException(400, "You're not userData");
        const findUser = await this.users.findOne({ email: userData.email, password: userData.password });
        if (!findUser)
            throw new HttpException_1.HttpException(409, `You're email ${userData.email} not found`);
    }
    userResponseFilter(userData) {
        const user = Object.assign({}, userData);
        delete user.password;
        delete user.term_agree_timestamp;
        delete user.updated_at;
        if (user.profile_photo) {
            user.profile_photo = (0, util_1.profileImageGenerator)(user.profile_photo);
        }
        return user;
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