"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const validation_middleware_1 = tslib_1.__importDefault(require("../middlewares/validation.middleware"));
const admin_dto_1 = require("../dtos/admin.dto");
const admin_controller_1 = tslib_1.__importDefault(require("../controllers/admin.controller"));
class AdminRoute {
    constructor() {
        this.path = '/admin/';
        this.router = (0, express_1.Router)();
        this.adminController = new admin_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}login`, (0, validation_middleware_1.default)(admin_dto_1.AdminLoginDto, 'body'), this.adminController.adminLogin);
    }
}
exports.default = AdminRoute;
//# sourceMappingURL=admin.route.js.map