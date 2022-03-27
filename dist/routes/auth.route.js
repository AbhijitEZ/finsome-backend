"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const auth_controller_1 = tslib_1.__importDefault(require("../controllers/auth.controller"));
const users_dto_1 = require("../dtos/users.dto");
const auth_middleware_1 = tslib_1.__importDefault(require("../middlewares/auth.middleware"));
const validation_middleware_1 = tslib_1.__importDefault(require("../middlewares/validation.middleware"));
const global_1 = require("../utils/global");
class AuthRoute {
    constructor() {
        this.path = '/';
        this.router = (0, express_1.Router)();
        this.authController = new auth_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}verify-phone`, (0, validation_middleware_1.default)(users_dto_1.VerifyPhoneDto, 'body'), this.authController.verifyPhoneNumber);
        this.router.post(`${this.path}verify-otp`, (0, validation_middleware_1.default)(users_dto_1.VerifyOtpDTO, 'body'), this.authController.verifyOTP);
        this.router.post(`${this.path}forgot-password`, (0, validation_middleware_1.default)(users_dto_1.VerifyPhoneDto, 'body'), this.authController.forgotPassword);
        this.router.post(`${this.path}validate-user-field`, (0, validation_middleware_1.default)(users_dto_1.ValidateUserFieldDto, 'body'), this.authController.validateUserField);
        this.router.post(`${this.path}signup-phone-verify`, (0, validation_middleware_1.default)(users_dto_1.SignupPhoneDto, 'body'), this.authController.signUpPhoneVerify);
        this.router.post(`${this.path}signup-user-verify`, (0, validation_middleware_1.default)(users_dto_1.CreateUserDto, 'body'), this.authController.signUpUserVerify);
        this.router.post(`${this.path}login`, (0, validation_middleware_1.default)(users_dto_1.LoginDto, 'body'), this.authController.logIn);
        this.router.post(`${this.path}change-password`, (0, validation_middleware_1.default)(users_dto_1.ChangePasswordDto, 'body'), auth_middleware_1.default, this.authController.changePassword);
        this.router.get(`${this.path}profile`, auth_middleware_1.default, this.authController.profile);
        this.router.post(`${this.path}profile`, global_1.fileUploadCB, (0, validation_middleware_1.default)(users_dto_1.ProfileUpdateDto, 'body'), auth_middleware_1.default, this.authController.editProfile);
        this.router.post(`${this.path}notification`, (0, validation_middleware_1.default)(users_dto_1.NotificationDto, 'body'), auth_middleware_1.default, this.authController.notificationUpdate);
        this.router.post(`${this.path}logout`, auth_middleware_1.default, this.authController.logOut);
        // SECTION: General APIS => START
        this.router.get(`${this.path}app-improvement-types`, this.authController.appImprovementTypes);
        this.router.post(`${this.path}app-improvement-types-user`, (0, validation_middleware_1.default)(users_dto_1.AppImprovementUserDto, 'body'), auth_middleware_1.default, this.authController.updateUserAppImprovementSuggestion);
        this.router.post(`${this.path}quick-contact`, (0, validation_middleware_1.default)(users_dto_1.QuickContactDto, 'body'), auth_middleware_1.default, this.authController.addQuickContact);
        // !SECTION: General APIS => END
    }
}
exports.default = AuthRoute;
//# sourceMappingURL=auth.route.js.map