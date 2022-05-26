"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const post_controller_1 = tslib_1.__importDefault(require("../controllers/post.controller"));
const validation_middleware_1 = tslib_1.__importDefault(require("../middlewares/validation.middleware"));
const auth_middleware_1 = tslib_1.__importDefault(require("../middlewares/auth.middleware"));
const posts_dto_1 = require("../dtos/posts.dto");
const global_1 = require("../utils/global");
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
        this.router.post(`${this.path}create`, auth_middleware_1.default, global_1.fileUploadPostCB, (0, validation_middleware_1.default)(posts_dto_1.PostCreateDto, 'body'), this.postController.postCreate);
        this.router.delete(`${this.path}delete/:postId`, auth_middleware_1.default, this.postController.postDelete);
        this.router.get(`${this.path}explore`, auth_middleware_1.default, this.postController.postExplore);
        this.router.get(`${this.path}home`, auth_middleware_1.default, (0, validation_middleware_1.default)(posts_dto_1.PostHomeDto, 'query'), this.postController.postHome);
        this.router.post(`${this.path}comment`, auth_middleware_1.default, (0, validation_middleware_1.default)(posts_dto_1.CommentsAddDto, 'body'), this.postController.commentAdd);
        this.router.get(`${this.path}comment`, auth_middleware_1.default, (0, validation_middleware_1.default)(posts_dto_1.IdPaginationDto, 'query'), this.postController.commentListing);
        this.router.delete(`${this.path}comment/:postId/:id`, auth_middleware_1.default, this.postController.commentDelete);
        this.router.post(`${this.path}like`, auth_middleware_1.default, (0, validation_middleware_1.default)(posts_dto_1.LikePostDto, 'body'), this.postController.postLikeUpdate);
        this.router.post(`${this.path}complaint`, auth_middleware_1.default, (0, validation_middleware_1.default)(posts_dto_1.ComplaintAddDto, 'body'), this.postController.complaintAdd);
    }
}
exports.default = PostRoute;
//# sourceMappingURL=post.route.js.map