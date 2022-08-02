"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const validation_middleware_1 = tslib_1.__importDefault(require("../middlewares/validation.middleware"));
const admin_dto_1 = require("../dtos/admin.dto");
const admin_controller_1 = tslib_1.__importDefault(require("../controllers/admin.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const posts_dto_1 = require("../dtos/posts.dto");
const global_1 = require("../utils/global");
/**
 * This route would only be used by the Web panel specifc to admin.
 */
class AdminRoute {
    constructor() {
        this.path = '/admin/';
        this.router = (0, express_1.Router)();
        this.adminController = new admin_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}login`, (0, validation_middleware_1.default)(admin_dto_1.AdminLoginDto, 'body'), this.adminController.adminLogin);
        /* User */
        this.router.post(`${this.path}users`, auth_middleware_1.authAdminMiddleware, this.adminController.userListing);
        this.router.post(`${this.path}dashboard`, auth_middleware_1.authAdminMiddleware, this.adminController.dashboardData);
        this.router.post(`${this.path}toggle-user-status`, (0, validation_middleware_1.default)(admin_dto_1.ToggleUserStatusDto, 'body'), auth_middleware_1.authAdminMiddleware, this.adminController.toggleUserStatus);
        this.router.post(`${this.path}userById`, auth_middleware_1.authAdminMiddleware, this.adminController.userById);
        this.router.post(`${this.path}deleteUser`, auth_middleware_1.authAdminMiddleware, this.adminController.deleteUser);
        /* !User */
        /* App Suggestion and Contacts */
        this.router.post(`${this.path}app-improvement-suggestions`, auth_middleware_1.authAdminMiddleware, this.adminController.appImprovementSuggestion);
        this.router.post(`${this.path}quick-contacts`, auth_middleware_1.authAdminMiddleware, this.adminController.quickContactListing);
        /* !App Suggestion and Contacts */
        /* Stocks */
        this.router.post(`${this.path}stock/:type`, auth_middleware_1.authAdminMiddleware, (0, validation_middleware_1.default)(posts_dto_1.StockUpdateTypeDto, 'body'), this.adminController.stockTypeAdd);
        this.router.delete(`${this.path}stock/:type/:id`, auth_middleware_1.authAdminMiddleware, this.adminController.stockTypeDelete);
        this.router.post(`${this.path}stock-upload/:type`, auth_middleware_1.authAdminMiddleware, global_1.fileUploadCSVCB, this.adminController.stockTypeUpload);
        /* !Stocks */
        /* Complaints */
        this.router.post(`${this.path}complaints`, auth_middleware_1.authAdminMiddleware, this.adminController.complaintsListing);
        /* Policies */
        this.router.get(`${this.path}privacy-policy`, this.adminController.privacyPolicy);
        this.router.post(`${this.path}privacy-policy`, (0, validation_middleware_1.default)(admin_dto_1.PrivacyPolicyDto, 'body'), auth_middleware_1.authAdminMiddleware, this.adminController.privacyPolicyUpdate);
        this.router.get(`${this.path}terms-condition`, this.adminController.termsConditionListing);
        this.router.post(`${this.path}terms-condition`, (0, validation_middleware_1.default)(admin_dto_1.PrivacyPolicyDto, 'body'), auth_middleware_1.authAdminMiddleware, this.adminController.termsConditionUpdate);
        this.router.post(`${this.path}send-notification`, (0, validation_middleware_1.default)(admin_dto_1.SendNotificationDto, 'body'), this.adminController.sendNotification);
        /* !Policies */
        this.router.post(`${this.path}delete-user-rating`, auth_middleware_1.authAdminMiddleware, this.adminController.deleteUserRating);
        //Article
        this.router.post(`${this.path}get-article-category`, auth_middleware_1.authAdminMiddleware, this.adminController.articleCategory);
        this.router.post(`${this.path}get-article-listing`, auth_middleware_1.authAdminMiddleware, this.adminController.articleListing);
        this.router.post(`${this.path}get-single-article`, this.adminController.getSingleArticle);
        this.router.post(`${this.path}save-article`, global_1.fileUploadCB, this.adminController.saveArticle);
        this.router.post(`${this.path}delete-article`, this.adminController.deleteArticle);
    }
}
exports.default = AdminRoute;
//# sourceMappingURL=admin.route.js.map