"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const auth_service_1 = tslib_1.__importDefault(require("../services/auth.service"));
const constants_1 = require("../utils/constants");
const global_1 = require("../utils/global");
const HttpException_1 = require("../exceptions/HttpException");
class AuthController {
    constructor() {
        this.authService = new auth_service_1.default();
        this.validateUserField = async (req, res, next) => {
            try {
                const reqPayload = req.body;
                await this.authService.validateUserField(reqPayload);
                (0, global_1.responseJSONMapper)(res, 200, {}, constants_1.APP_SUCCESS_MESSAGE.validate_user_field_success);
            }
            catch (error) {
                next(error);
            }
        };
        this.verifyPhoneNumber = async (req, res, next) => {
            try {
                const reqPayload = req.body;
                await this.authService.verifyPhoneNumber(reqPayload);
                // TODO: OTP phase would be dynamic after the client confirmation
                (0, global_1.responseJSONMapper)(res, 200, Object.assign(Object.assign({}, reqPayload), { otp: 9999 }), constants_1.APP_SUCCESS_MESSAGE.sent_otp_success);
            }
            catch (error) {
                next(error);
            }
        };
        this.verifyOTP = async (req, res, next) => {
            try {
                const reqPayload = req.body;
                await this.authService.verifyOtp(reqPayload);
                // TODO: OTP phase would be dynamic after the client confirmation
                (0, global_1.responseJSONMapper)(res, 200, {}, constants_1.APP_SUCCESS_MESSAGE.verify_otp_success);
            }
            catch (error) {
                next(error);
            }
        };
        this.signUpPhoneVerify = async (req, res, next) => {
            try {
                const userData = req.body;
                // TODO: Would have actual OTP check after client confirmation
                if (userData.otp !== 9999) {
                    throw new HttpException_1.HttpException(400, constants_1.APP_ERROR_MESSAGE.otp_invalid);
                }
                delete userData.otp;
                const { user } = await this.authService.signUpPhoneVerify(userData);
                (0, global_1.responseJSONMapper)(res, 201, { user }, constants_1.APP_SUCCESS_MESSAGE.signup_phone_verify_success);
            }
            catch (error) {
                next(error);
            }
        };
        this.signUpUserVerify = async (req, res, next) => {
            try {
                const userData = req.body;
                const { cookie, token_data, user } = await this.authService.signUpUserVerify(userData);
                res.setHeader('Set-Cookie', [cookie]);
                (0, global_1.responseJSONMapper)(res, 201, { token_data, user }, constants_1.APP_SUCCESS_MESSAGE.signup_success);
            }
            catch (error) {
                next(error);
            }
        };
        this.logIn = async (req, res, next) => {
            try {
                const userData = req.body;
                const { cookie, token_data, user } = await this.authService.login(userData);
                res.setHeader('Set-Cookie', [cookie]);
                (0, global_1.responseJSONMapper)(res, 200, { token_data, user }, constants_1.APP_SUCCESS_MESSAGE.login_success);
            }
            catch (error) {
                next(error);
            }
        };
        this.forgotPassword = async (req, res, next) => {
            try {
                const reqPayload = req.body;
                await this.authService.forgotPassword(reqPayload);
                // TODO: OTP phase would be dynamic after the client confirmation
                (0, global_1.responseJSONMapper)(res, 200, Object.assign(Object.assign({}, reqPayload), { otp: 9999 }), constants_1.APP_SUCCESS_MESSAGE.sent_otp_success);
            }
            catch (error) {
                next(error);
            }
        };
        this.changePassword = async (req, res, next) => {
            try {
                const userData = req.body;
                // @ts-ignore
                await this.authService.changePassword(userData, req.user._id);
                (0, global_1.responseJSONMapper)(res, 200, {}, constants_1.APP_SUCCESS_MESSAGE.change_password_success);
            }
            catch (error) {
                next(error);
            }
        };
        this.profile = async (req, res, next) => {
            try {
                // @ts-ignore
                const user = await this.authService.profile(req.user._id);
                (0, global_1.responseJSONMapper)(res, 200, Object.assign({}, user), constants_1.APP_SUCCESS_MESSAGE.update_profile_success);
            }
            catch (error) {
                next(error);
            }
        };
        this.editProfile = async (req, res, next) => {
            try {
                // @ts-ignore
                await this.authService.editProfile(req.body, req.file, req.user._id);
                (0, global_1.responseJSONMapper)(res, 200, {}, constants_1.APP_SUCCESS_MESSAGE.update_profile_success);
            }
            catch (error) {
                next(error);
            }
        };
        this.notificationUpdate = async (req, res, next) => {
            try {
                const userData = req.body;
                // @ts-ignore
                await this.authService.notificationUpdate(userData, req.user._id);
                (0, global_1.responseJSONMapper)(res, 200, Object.assign({}, userData), constants_1.APP_SUCCESS_MESSAGE.notification_update_success);
            }
            catch (error) {
                next(error);
            }
        };
        this.logOut = async (req, res, next) => {
            try {
                const userData = req.user;
                await this.authService.logout(userData);
                res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
                res.status(200).json({ data: {}, message: constants_1.APP_SUCCESS_MESSAGE.logout_success });
            }
            catch (error) {
                next(error);
            }
        };
        this.appImprovementTypes = async (req, res, next) => {
            try {
                const data = await this.authService.appImprovementTypes();
                (0, global_1.responseJSONMapper)(res, 200, data);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateUserAppImprovementSuggestion = async (req, res, next) => {
            try {
                const data = await this.authService.updateUserAppImprovementSuggestion(req.body, req.user._id);
                (0, global_1.responseJSONMapper)(res, 201, data);
            }
            catch (error) {
                next(error);
            }
        };
        this.addQuickContact = async (req, res, next) => {
            try {
                const data = await this.authService.addQuickContact(req.body);
                (0, global_1.responseJSONMapper)(res, 201, data);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = AuthController;
//# sourceMappingURL=auth.controller.js.map