"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const index_controller_1 = tslib_1.__importDefault(require("../../controllers/index.controller"));
class IndexRoute {
    constructor() {
        this.path = '/';
        this.router = (0, express_1.Router)();
        this.indexController = new index_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, this.indexController.index);
        // SCRIPT
        this.router.get(`${this.path}script/add-admin`, this.indexController.addAdminScript);
        this.router.get(`${this.path}script/default-notification`, this.indexController.addNotificationDefaultToAllUser);
        this.router.get(`${this.path}script/user-config-default`, this.indexController.updateDefaultConfigurationUsers);
    }
}
exports.default = IndexRoute;
//# sourceMappingURL=index.route.js.map