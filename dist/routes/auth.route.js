"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const auth_controller_1 = tslib_1.__importDefault(require("../controllers/auth.controller"));
const users_dto_1 = require("../dtos/users.dto");
const auth_middleware_1 = tslib_1.__importStar(require("../middlewares/auth.middleware"));
const validation_middleware_1 = tslib_1.__importDefault(require("../middlewares/validation.middleware"));
const global_1 = require("../utils/global");
const general_dto_1 = require("../dtos/general.dto");
class AuthRoute {
    constructor() {
        this.path = '/';
        this.router = (0, express_1.Router)();
        this.authController = new auth_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}verify-phone`, (0, validation_middleware_1.default)(users_dto_1.VerifyPhoneDto, 'body'), auth_middleware_1.authOptionalMiddleware, this.authController.verifyPhoneNumberWithOTP);
        this.router.post(`${this.path}verify-otp`, (0, validation_middleware_1.default)(users_dto_1.VerifyOtpDTO, 'body'), this.authController.verifyOTP);
        this.router.post(`${this.path}forgot-password`, (0, validation_middleware_1.default)(users_dto_1.VerifyPhoneDto, 'body'), this.authController.forgotPassword);
        this.router.post(`${this.path}reset-password`, (0, validation_middleware_1.default)(users_dto_1.ResetPasswordDto, 'body'), this.authController.resetPassword);
        this.router.post(`${this.path}validate-user-field`, (0, validation_middleware_1.default)(users_dto_1.ValidateUserFieldDto, 'body'), this.authController.validateUserField);
        this.router.post(`${this.path}signup-phone-verify`, (0, validation_middleware_1.default)(users_dto_1.SignupPhoneDto, 'body'), this.authController.signUpPhoneVerify);
        this.router.post(`${this.path}signup-user-verify`, (0, validation_middleware_1.default)(users_dto_1.CreateUserDto, 'body'), this.authController.signUpUserVerify);
        this.router.post(`${this.path}login`, (0, validation_middleware_1.default)(users_dto_1.LoginDto, 'body'), this.authController.logIn);
        this.router.post(`${this.path}change-password`, (0, validation_middleware_1.default)(users_dto_1.ChangePasswordDto, 'body'), auth_middleware_1.default, this.authController.changePassword);
        this.router.get(`${this.path}profile`, auth_middleware_1.default, this.authController.profile);
        this.router.post(`${this.path}profile`, global_1.fileUploadCB, (0, validation_middleware_1.default)(users_dto_1.ProfileUpdateDto, 'body'), auth_middleware_1.default, this.authController.editProfile);
        this.router.post(`${this.path}change-phone-number`, (0, validation_middleware_1.default)(users_dto_1.VerifyOtpDTO, 'body'), auth_middleware_1.default, this.authController.changePhoneNumber);
        this.router.post(`${this.path}notification`, (0, validation_middleware_1.default)(users_dto_1.NotificationDto, 'body'), auth_middleware_1.default, this.authController.notificationUpdate);
        this.router.post(`${this.path}logout`, auth_middleware_1.default, (0, validation_middleware_1.default)(users_dto_1.DeviceTokenLogoutDto, 'body'), this.authController.logOut);
        this.router.post(`${this.path}device-token`, auth_middleware_1.default, (0, validation_middleware_1.default)(users_dto_1.DeviceTokenLogoutDto, 'body'), this.authController.deviceTokenAdd);
        // SECTION: General APIS => START
        this.router.get(`${this.path}app-improvement-types`, this.authController.appImprovementTypes);
        this.router.get(`${this.path}app-improvement-types-user`, auth_middleware_1.default, this.authController.getUserAppImprovementSuggestion);
        this.router.post(`${this.path}app-improvement-types-user`, (0, validation_middleware_1.default)(users_dto_1.AppImprovementUserDto, 'body'), auth_middleware_1.default, this.authController.updateUserAppImprovementSuggestion);
        this.router.post(`${this.path}quick-contact`, (0, validation_middleware_1.default)(users_dto_1.QuickContactDto, 'body'), auth_middleware_1.default, this.authController.addQuickContact);
        this.router.post(`${this.path}follow`, (0, validation_middleware_1.default)(users_dto_1.FollowDto, 'body'), auth_middleware_1.default, this.authController.followerRequest);
        this.router.get(`${this.path}follow-accept/:followId`, auth_middleware_1.default, this.authController.followAcceptByUser);
        this.router.delete(`${this.path}follow/:followId`, auth_middleware_1.default, this.authController.followDeleteRequest);
        this.router.get(`${this.path}follower/:followId`, auth_middleware_1.default, (0, validation_middleware_1.default)(general_dto_1.PaginationDto, 'query'), this.authController.followerListing);
        this.router.get(`${this.path}following/:followId`, auth_middleware_1.default, (0, validation_middleware_1.default)(general_dto_1.PaginationDto, 'query'), this.authController.followingListing);
        this.router.get(`${this.path}users-list`, (0, validation_middleware_1.default)(users_dto_1.UserListingDto, 'query'), auth_middleware_1.default, this.authController.userListing);
        this.router.get(`${this.path}user-detail/:id`, auth_middleware_1.default, this.authController.userDetail);
        this.router.get(`${this.path}user/notifications`, auth_middleware_1.default, (0, validation_middleware_1.default)(general_dto_1.PaginationDto, 'query'), this.authController.userNotifications);
        this.router.get(`${this.path}user/total-unread-notifications`, auth_middleware_1.default, this.authController.userUnReadNotifications);
        this.router.post(`${this.path}user/mark-read-notifications`, auth_middleware_1.default, (0, validation_middleware_1.default)(users_dto_1.NotificationMarkReadDto, 'body'), this.authController.userMarkNotifications);
        this.router.post(`${this.path}user/subscription-notifications`, auth_middleware_1.default, (0, validation_middleware_1.default)(users_dto_1.NotificationSubscriptionDto, 'body'), this.authController.subscriptionToggleNotification);
        this.router.post(`${this.path}user/rate/:userId`, (0, validation_middleware_1.default)(users_dto_1.UserRateDto, 'body'), auth_middleware_1.default, this.authController.userRating);
        this.router.get(`${this.path}user/rate/:userId`, (0, validation_middleware_1.default)(users_dto_1.UserListingRateDto, 'query'), auth_middleware_1.default, this.authController.userListingRate);
        this.router.post(`${this.path}user/rate`, auth_middleware_1.default, this.authController.userListingRate2);
        this.router.get(`${this.path}user/rate-detail/:userRateId`, auth_middleware_1.default, this.authController.userRateDetails);
        this.router.delete(`${this.path}user/rate/delete/:userRateId`, auth_middleware_1.default, this.authController.userRateRemove);
        this.router.get(`${this.path}user/rate-statistics/:userId`, auth_middleware_1.default, this.authController.userRatingStatistics);
        // !SECTION: General APIS => END
    }
}
exports.default = AuthRoute;
//# sourceMappingURL=auth.route.js.map