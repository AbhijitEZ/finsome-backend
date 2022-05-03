"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const post_controller_1 = tslib_1.__importDefault(require("../controllers/post.controller"));
const validation_middleware_1 = tslib_1.__importDefault(require("../middlewares/validation.middleware"));
const auth_middleware_1 = tslib_1.__importDefault(require("../middlewares/auth.middleware"));
const posts_dto_1 = require("../dtos/posts.dto");
class PostRoute {
    constructor() {
        this.path = '/post/';
        this.router = (0, express_1.Router)();
        this.postController = new post_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}countries`, this.postController.countriesController);
        this.router.get(`${this.path}stock-type`, auth_middleware_1.default, (0, validation_middleware_1.default)(posts_dto_1.StockTypeDto, 'query'), this.postController.stockTypesController);
        this.router.get(`${this.path}user-configurations`, auth_middleware_1.default, this.postController.userConfigurationListing);
        this.router.post(`${this.path}user-configurations`, auth_middleware_1.default, (0, validation_middleware_1.default)(posts_dto_1.UserConfigurationDto, 'body'), this.postController.userConfigurationUpdate);
        this.router.post(`${this.path}create`, auth_middleware_1.default, (0, validation_middleware_1.default)(posts_dto_1.PostCreateDto, 'body'), this.postController.postCreate);
    }
}
exports.default = PostRoute;
//# sourceMappingURL=post.route.js.map