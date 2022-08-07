"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const admin_service_1 = tslib_1.__importDefault(require("../services/admin.service"));
const constants_1 = require("../utils/constants");
const HttpException_1 = require("../exceptions/HttpException");
const firecustom_1 = tslib_1.__importDefault(require("../utils/firecustom"));
const lodash_1 = tslib_1.__importDefault(require("lodash"));
class AdminController {
    constructor() {
        this.adminService = new admin_service_1.default();
        this.adminLogin = async (req, res, next) => {
            try {
                const { token } = await this.adminService.adminLogin(req.body);
                res.status(200).json({ data: { token }, message: constants_1.APP_SUCCESS_MESSAGE.login_success });
            }
            catch (error) {
                next(error);
            }
        };
        this.userListing = async (req, res, next) => {
            try {
                const users = await this.adminService.userListing(req.user, req);
                res.status(200).json({ data: users });
            }
            catch (error) {
                next(error);
            }
        };
        this.dashboardData = async (req, res, next) => {
            try {
                const users = await this.adminService.dashboardData(req.user);
                res.status(200).json({ data: users });
            }
            catch (error) {
                next(error);
            }
        };
        this.toggleUserStatus = async (req, res, next) => {
            try {
                await this.adminService.toggleUserStatus(req.body);
                res.status(200).json({ data: {} });
            }
            catch (error) {
                next(error);
            }
        };
        this.userById = async (req, res, next) => {
            try {
                const { userId } = req.body;
                if (!userId) {
                    throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.id_not_exists);
                }
                let user = await this.adminService.getUser(userId);
                res.status(200).json({ data: user, message: constants_1.APP_SUCCESS_MESSAGE.delete_user_success });
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteUser = async (req, res, next) => {
            try {
                const { userId } = req.body;
                if (!userId) {
                    throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.id_not_exists);
                }
                await this.adminService.deleteUser(userId);
                res.status(200).json({ data: {}, message: constants_1.APP_SUCCESS_MESSAGE.delete_user_success });
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteUserRating = async (req, res, next) => {
            try {
                const { ratingId } = req.body;
                if (!ratingId) {
                    throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.id_not_exists);
                }
                let response = await this.adminService.deleteUserRating({ id: ratingId });
                res.status(200).json({ data: response, message: constants_1.APP_SUCCESS_MESSAGE.delete_user_success });
            }
            catch (error) {
                next(error);
            }
        };
        this.privacyPolicy = async (req, res, next) => {
            try {
                const data = await this.adminService.privacyPolicyListing();
                res.status(200).json({ data });
            }
            catch (error) {
                next(error);
            }
        };
        this.termsConditionListing = async (req, res, next) => {
            try {
                const data = await this.adminService.termsConditionListing();
                res.status(200).json({ data });
            }
            catch (error) {
                next(error);
            }
        };
        this.termsConditionUpdate = async (req, res, next) => {
            try {
                await this.adminService.termsConditionUpdate(req.body);
                res.status(200).json({ data: {} });
            }
            catch (error) {
                next(error);
            }
        };
        this.privacyPolicyUpdate = async (req, res, next) => {
            try {
                await this.adminService.privacyPolicyUpdate(req.body);
                res.status(200).json({ data: {} });
            }
            catch (error) {
                next(error);
            }
        };
        this.appImprovementSuggestion = async (req, res, next) => {
            try {
                const data = await this.adminService.appImprovementSuggestion(req.body);
                res.status(200).json({ data });
            }
            catch (error) {
                next(error);
            }
        };
        this.quickContactListing = async (req, res, next) => {
            try {
                const users = await this.adminService.quickContactListing(req.body);
                res.status(200).json({ data: users });
            }
            catch (error) {
                next(error);
            }
        };
        this.complaintsListing = async (req, res, next) => {
            try {
                const users = await this.adminService.complaintsListing(req.body);
                res.status(200).json({ data: users });
            }
            catch (error) {
                next(error);
            }
        };
        this.stockTypeAdd = async (req, res, next) => {
            var _a;
            try {
                // @ts-ignore
                const data = await this.adminService.stockTypeAdd(((_a = req.params) === null || _a === void 0 ? void 0 : _a.type) || constants_1.STOCK_TYPE_CONST.EQUITY, req.body);
                res.status(200).json({ data });
            }
            catch (error) {
                next(error);
            }
        };
        this.stockTypeDelete = async (req, res, next) => {
            var _a, _b;
            try {
                // @ts-ignore
                await this.adminService.stockTypeDelete(((_a = req.params) === null || _a === void 0 ? void 0 : _a.type) || constants_1.STOCK_TYPE_CONST.EQUITY, (_b = req.params) === null || _b === void 0 ? void 0 : _b.id);
                res.status(200).json({ data: {} });
            }
            catch (error) {
                next(error);
            }
        };
        this.stockTypeUpload = async (req, res, next) => {
            var _a;
            try {
                // @ts-ignore
                await this.adminService.stockTypeUpload(((_a = req.params) === null || _a === void 0 ? void 0 : _a.type) || constants_1.STOCK_TYPE_CONST.EQUITY, req.file.path);
                res.status(200).json({ data: {}, message: constants_1.APP_SUCCESS_MESSAGE.csv_upload_success });
            }
            catch (error) {
                next(error);
            }
        };
        this.articleListing = async (req, res, next) => {
            try {
                let response = await this.adminService.getArticles(req.body);
                res.status(200).json({ data: response, message: 'Article listing!' });
            }
            catch (error) {
                next(error);
            }
        };
        this.getSingleArticle = async (req, res, next) => {
            try {
                let response = await this.adminService.getSingleArticle(req.body);
                res.status(200).json({ data: response, message: 'Article listing!' });
            }
            catch (error) {
                next(error);
            }
        };
        this.saveArticleCategory = async (req, res, next) => {
            try {
                const response = await this.adminService.saveArticleCategory(req.body);
                if (response) {
                    res.status(200).json({ data: 1, message: 'Article category saved!' });
                }
                else {
                    res.status(200).json({ data: 0, message: 'Unable to save article category!' });
                }
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteArticleCategory = async (req, res, next) => {
            try {
                const response = await this.adminService.saveArticleCategory(req.body);
                if (response) {
                    res.status(200).json({ data: 1, message: 'Article category saved!' });
                }
                else {
                    res.status(200).json({ data: 0, message: 'Unable to save article category!' });
                }
            }
            catch (error) {
                next(error);
            }
        };
        this.articleCategory = async (req, res, next) => {
            try {
                let response = await this.adminService.getArticleCategories();
                res.status(200).json({ data: response, message: 'Article listing!' });
            }
            catch (error) {
                next(error);
            }
        };
        this.saveArticle = async (req, res, next) => {
            try {
                let response = await this.adminService.saveArticle(req.body, req.file);
                res.status(200).json({ data: response, message: response ? 'Article saved!' : 'Unable to save article' });
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteArticle = async (req, res, next) => {
            try {
                let response = await this.adminService.deleteArticle(req.body);
                res.status(200).json({ data: response, message: response ? 'Article deleted!' : 'Unable to delete article' });
            }
            catch (error) {
                next(error);
            }
        };
        this.sendNotification = async (req, res, next) => {
            try {
                const title = req.body.title;
                const body = req.body.body;
                const userIds = req.body.userIds;
                let tokens = await this.adminService.getAllUserTokens(userIds);
                let promises = [];
                const chunks = lodash_1.default.chunk(tokens, 100);
                chunks.forEach(e => {
                    const msg = {
                        notification: {
                            title: title,
                            body: body,
                        },
                        tokens: e,
                        android: {
                            priority: 'high',
                        },
                    };
                    promises.push(firecustom_1.default.sendAllNotification(msg));
                });
                const result = await Promise.all(promises);
                let accepted = 0;
                let rejected = 0;
                result.forEach(response => {
                    if (response != undefined) {
                        accepted += response.successCount;
                        rejected += response.failureCount;
                    }
                });
                res.status(200).json({ data: { accepted, rejected }, message: constants_1.APP_SUCCESS_MESSAGE.notification_success });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = AdminController;
//# sourceMappingURL=admin.controller.js.map