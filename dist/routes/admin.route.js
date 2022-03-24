"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const validation_middleware_1 = tslib_1.__importDefault(require("../middlewares/validation.middleware"));
const admin_dto_1 = require("../dtos/admin.dto");
const admin_controller_1 = tslib_1.__importDefault(require("../controllers/admin.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
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
        this.router.get(`${this.path}users`, auth_middleware_1.authAdminMiddleware, this.adminController.userListing);
        this.router.post(`${this.path}toggle-user-status`, (0, validation_middleware_1.default)(admin_dto_1.ToggleUserStatusDto, 'body'), auth_middleware_1.authAdminMiddleware, this.adminController.toggleUserStatus);
        this.router.get(`${this.path}app-improvement-suggestions`, auth_middleware_1.authAdminMiddleware, this.adminController.appImprovementSuggestion);
    }
}
exports.default = AdminRoute;
//# sourceMappingURL=admin.route.js.map