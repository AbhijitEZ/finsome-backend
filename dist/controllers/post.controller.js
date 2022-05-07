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
        this.stockTypesController = async (req, res, next) => {
            try {
                // @ts-ignore
                const data = await this.postService.stockTypesShares(req.query);
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
            var _a;
            try {
                // @ts-ignore
                const data = await this.postService.postCreate((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, req.body, req.files);
                (0, global_1.responseJSONMapper)(res, 200, Object.assign({}, data));
            }
            catch (error) {
                next(error);
            }
        };
        this.postExplore = async (req, res, next) => {
            var _a;
            try {
                // @ts-ignore
                const data = await this.postService.postExplore((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
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