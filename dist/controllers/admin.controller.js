"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const admin_service_1 = tslib_1.__importDefault(require("../services/admin.service"));
const constants_1 = require("../utils/constants");
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
    }
}
exports.default = AdminController;
//# sourceMappingURL=admin.controller.js.map