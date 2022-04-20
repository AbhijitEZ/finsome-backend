"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const post_controller_1 = tslib_1.__importDefault(require("../controllers/post.controller"));
class PostRoute {
    constructor() {
        this.path = '/post/';
        this.router = (0, express_1.Router)();
        this.postController = new post_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}countries`, this.postController.countriesController);
    }
}
exports.default = PostRoute;
//# sourceMappingURL=post.route.js.map