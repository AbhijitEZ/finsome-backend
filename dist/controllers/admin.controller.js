"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const admin_service_1 = tslib_1.__importDefault(require("../services/admin.service"));
const constants_1 = require("../utils/constants");
const HttpException_1 = require("../exceptions/HttpException");
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
                const users = await this.adminService.userListing(req.user);
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
        this.deleteUser = async (req, res, next) => {
            try {
                const { id } = req.params;
                if (!id) {
                    throw new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.id_not_exists);
                }
                await this.adminService.deleteUser(id);
                res.status(200).json({ data: {}, message: constants_1.APP_SUCCESS_MESSAGE.delete_user_success });
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
                const data = await this.adminService.appImprovementSuggestion();
                res.status(200).json({ data });
            }
            catch (error) {
                next(error);
            }
        };
        this.quickContactListing = async (req, res, next) => {
            try {
                const users = await this.adminService.quickContactListing();
                res.status(200).json({ data: users });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = AdminController;
//# sourceMappingURL=admin.controller.js.map