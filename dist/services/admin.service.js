"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const config_1 = tslib_1.__importDefault(require("config"));
const jsonwebtoken_1 = require("jsonwebtoken");
const HttpException_1 = require("../exceptions/HttpException");
const constants_1 = require("../utils/constants");
const users_model_1 = tslib_1.__importDefault(require("../models/users.model"));
class AdminService {
    constructor() {
        this.users = users_model_1.default;
    }
    async adminLogin(loginDto) {
        const adminUser = await this.users.findOne({
            email: loginDto.email,
            password: loginDto.password,
            role: constants_1.USER_ROLE.ADMIN,
        });
        if (!adminUser) {
            throw new HttpException_1.HttpException(400, constants_1.APP_ERROR_MESSAGE.user_not_exists);
        }
        const dataStoredInToken = { _id: adminUser._id, role: adminUser.role };
        const secretKey = config_1.default.get('secretKey');
        const expiresIn = config_1.default.get('tokenExpiry');
        const token = (0, jsonwebtoken_1.sign)(dataStoredInToken, secretKey, { expiresIn });
        return { token };
    }
}
exports.default = AdminService;
//# sourceMappingURL=admin.service.js.map