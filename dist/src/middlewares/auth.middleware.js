"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authAdminMiddleware = exports.authOptionalMiddleware = void 0;
const tslib_1 = require("tslib");
const config_1 = tslib_1.__importDefault(require("config"));
const jsonwebtoken_1 = require("jsonwebtoken");
const HttpException_1 = require("../../exceptions/HttpException");
const users_model_1 = tslib_1.__importDefault(require("../../models/users.model"));
const constants_1 = require("../../utils/constants");
const authMiddleware = async (req, res, next) => {
    try {
        const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);
        if (Authorization) {
            const secretKey = config_1.default.get('secretKey');
            const verificationResponse = (await (0, jsonwebtoken_1.verify)(Authorization, secretKey));
            const userId = verificationResponse._id;
            const findUser = await users_model_1.default.findById(userId);
            if (findUser) {
                // @ts-ignore
                if (findUser.deleted_at) {
                    return next(new HttpException_1.HttpException(401, constants_1.APP_ERROR_MESSAGE.user_blocked));
                }
                req.user = findUser;
                next();
            }
            else {
                next(new HttpException_1.HttpException(401, constants_1.APP_ERROR_MESSAGE.invalid_token));
            }
        }
        else {
            next(new HttpException_1.HttpException(404, 'Authentication token missing'));
        }
    }
    catch (error) {
        next(new HttpException_1.HttpException(401, constants_1.APP_ERROR_MESSAGE.invalid_token));
    }
};
const authOptionalMiddleware = async (req, res, next) => {
    try {
        const Authorization = req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null;
        if (Authorization) {
            const secretKey = config_1.default.get('secretKey');
            const verificationResponse = (await (0, jsonwebtoken_1.verify)(Authorization, secretKey));
            const userId = verificationResponse._id;
            const findUser = await users_model_1.default.findById(userId);
            if (findUser) {
                // @ts-ignore
                if (findUser.deleted_at) {
                    return next(new HttpException_1.HttpException(401, constants_1.APP_ERROR_MESSAGE.user_blocked));
                }
                req.user = findUser;
                next();
            }
            else {
                next(new HttpException_1.HttpException(401, constants_1.APP_ERROR_MESSAGE.invalid_token));
            }
        }
        else {
            next();
        }
    }
    catch (error) {
        next(new HttpException_1.HttpException(401, constants_1.APP_ERROR_MESSAGE.invalid_token));
    }
};
exports.authOptionalMiddleware = authOptionalMiddleware;
const authAdminMiddleware = async (req, res, next) => {
    try {
        const Authorization = req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null;
        if (Authorization) {
            const secretKey = config_1.default.get('secretKey');
            const verificationResponse = (await (0, jsonwebtoken_1.verify)(Authorization, secretKey));
            const userId = verificationResponse._id;
            const findUser = await users_model_1.default.findById(userId);
            if (findUser) {
                if (findUser.role !== constants_1.USER_ROLE.ADMIN) {
                    return next(new HttpException_1.HttpException(403, constants_1.APP_ERROR_MESSAGE.forbidden_error));
                }
                req.user = findUser;
                next();
            }
            else {
                next(new HttpException_1.HttpException(401, constants_1.APP_ERROR_MESSAGE.invalid_token));
            }
        }
        else {
            next(new HttpException_1.HttpException(404, constants_1.APP_ERROR_MESSAGE.invalid_token));
        }
    }
    catch (error) {
        next(new HttpException_1.HttpException(401, constants_1.APP_ERROR_MESSAGE.invalid_token));
    }
};
exports.authAdminMiddleware = authAdminMiddleware;
exports.default = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map