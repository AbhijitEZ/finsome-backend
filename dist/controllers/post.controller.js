"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const post_service_1 = tslib_1.__importDefault(require("../services/post.service"));
const global_1 = require("../utils/global");
class PostController {
    constructor() {
        this.postService = new post_service_1.default();
        this.countriesController = async (req, res, next) => {
            try {
                const countries = await this.postService.countriesGetAll();
                (0, global_1.responseJSONMapper)(res, 200, countries);
            }
            catch (error) {
                next(error);
            }
        };
        this.articleListing = async (req, res, next) => {
            try {
                let response = await this.postService.getArticles(req.body);
                res.status(200).json({ data: response, message: 'Article listing!' });
            }
            catch (error) {
                next(error);
            }
        };
        this.stockTypesController = async (req, res, next) => {
            try {
                // @ts-ignore
                const data = await this.postService.stockTypesShares(req.method == 'POST' ? req.body : req.query);
                (0, global_1.responseJSONMapper)(res, 200, Object.assign({}, data));
            }
            catch (error) {
                next(error);
            }
        };
        this.userConfigurationListing = async (req, res, next) => {
            var _a;
            try {
                // @ts-ignore
                const data = await this.postService.userConfigListing((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
                (0, global_1.responseJSONMapper)(res, 200, Object.assign({}, data));
            }
            catch (error) {
                next(error);
            }
        };
        this.userConfigurationUpdate = async (req, res, next) => {
            var _a;
            try {
                // @ts-ignore
                const data = await this.postService.userConfigUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, req.body);
                (0, global_1.responseJSONMapper)(res, 200, Object.assign({}, data));
            }
            catch (error) {
                next(error);
            }
        };
        this.postCreate = async (req, res, next) => {
            var _a, _b, _c, _d;
            try {
                // @ts-ignore
                const data = await this.postService.postCreate((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, (_b = req.user) === null || _b === void 0 ? void 0 : _b.fullname, (_c = req.user) === null || _c === void 0 ? void 0 : _c.profile_photo, req.body, req.files, (_d = req.params) === null || _d === void 0 ? void 0 : _d.id);
                (0, global_1.responseJSONMapper)(res, 200, Object.assign({}, data));
            }
            catch (error) {
                next(error);
            }
        };
        this.postExplore = async (req, res, next) => {
            try {
                // @ts-ignore
                const data = await this.postService.postExplore();
                (0, global_1.responseJSONMapper)(res, 200, data);
            }
            catch (error) {
                next(error);
            }
        };
        this.postHome = async (req, res, next) => {
            var _a;
            try {
                // @ts-ignore
                const data = await this.postService.postHome((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, req.method == 'POST' ? req.body : req.query);
                (0, global_1.responseJSONMapper)(res, 200, data);
            }
            catch (error) {
                next(error);
            }
        };
        this.stockSearch = async (req, res, next) => {
            var _a;
            try {
                // @ts-ignore
                const data = await this.postService.stockSearch((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, req.query);
                (0, global_1.responseJSONMapper)(res, 200, data);
            }
            catch (error) {
                next(error);
            }
        };
        this.postDelete = async (req, res, next) => {
            var _a, _b;
            try {
                // @ts-ignore
                const data = await this.postService.postDelete((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, req.method == 'POST' ? req.body : (_b = req.params) === null || _b === void 0 ? void 0 : _b.postId);
                (0, global_1.responseJSONMapper)(res, 200, data);
            }
            catch (error) {
                next(error);
            }
        };
        this.postDetail = async (req, res, next) => {
            var _a, _b;
            try {
                // @ts-ignore
                const data = await this.postService.postDetail((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, (_b = req.params) === null || _b === void 0 ? void 0 : _b.postId);
                (0, global_1.responseJSONMapper)(res, 200, data);
            }
            catch (error) {
                next(error);
            }
        };
        this.postDetailByUserId = async (req, res, next) => {
            var _a, _b;
            try {
                // @ts-ignore
                const data = await this.postService.postDetail((_a = req.body) === null || _a === void 0 ? void 0 : _a.userId, (_b = req.body) === null || _b === void 0 ? void 0 : _b.postId);
                (0, global_1.responseJSONMapper)(res, 200, data);
            }
            catch (error) {
                next(error);
            }
        };
        this.postDeleteAssets = async (req, res, next) => {
            var _a, _b;
            try {
                // @ts-ignore
                const data = await this.postService.postDeleteAssets((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, (_b = req.params) === null || _b === void 0 ? void 0 : _b.postId, req.query);
                (0, global_1.responseJSONMapper)(res, 200, Object.assign({}, data));
            }
            catch (error) {
                next(error);
            }
        };
        this.commentListing = async (req, res, next) => {
            var _a;
            try {
                // @ts-ignore
                const data = await this.postService.commentListing((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, req.query);
                (0, global_1.responseJSONMapper)(res, 200, data);
            }
            catch (error) {
                next(error);
            }
        };
        this.commentAdd = async (req, res, next) => {
            var _a, _b, _c;
            try {
                // @ts-ignore
                const data = await this.postService.commentAdd((_a = req.user) === null || _a === void 0 ? void 0 : _a.fullname, (_b = req.user) === null || _b === void 0 ? void 0 : _b.profile_photo, (_c = req.user) === null || _c === void 0 ? void 0 : _c._id, req.body);
                (0, global_1.responseJSONMapper)(res, 200, data);
            }
            catch (error) {
                next(error);
            }
        };
        this.postLikeUpdate = async (req, res, next) => {
            var _a, _b, _c;
            try {
                // @ts-ignore
                const data = await this.postService.postLikeUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, (_b = req.user) === null || _b === void 0 ? void 0 : _b.fullname, (_c = req.user) === null || _c === void 0 ? void 0 : _c.profile_photo, req.body);
                (0, global_1.responseJSONMapper)(res, 200, data);
            }
            catch (error) {
                next(error);
            }
        };
        this.complaintAdd = async (req, res, next) => {
            var _a;
            try {
                // @ts-ignore
                const data = await this.postService.complaintAdd((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, req.body);
                (0, global_1.responseJSONMapper)(res, 200, data);
            }
            catch (error) {
                next(error);
            }
        };
        this.articleCatListing = async (req, res, next) => {
            try {
                // @ts-ignore
                const data = await this.postService.articleCatListing();
                (0, global_1.responseJSONMapper)(res, 200, data);
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        };
        this.articleAdd = async (req, res, next) => {
            var _a;
            try {
                // @ts-ignore
                const data = await this.postService.articleAdd((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, req.body);
                (0, global_1.responseJSONMapper)(res, 201, data);
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        };
        this.articleCategory = async (req, res, next) => {
            try {
                let response = await this.postService.getArticleCategories();
                res.status(200).json({ data: response, message: 'Article listing!' });
            }
            catch (error) {
                next(error);
            }
        };
        this.commentDelete = async (req, res, next) => {
            var _a, _b, _c;
            try {
                // @ts-ignore
                const data = await this.postService.commentDelete((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, (_b = req.params) === null || _b === void 0 ? void 0 : _b.postId, (_c = req.params) === null || _c === void 0 ? void 0 : _c.id);
                (0, global_1.responseJSONMapper)(res, 200, data);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = PostController;
//# sourceMappingURL=post.controller.js.map