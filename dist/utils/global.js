"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploadCB = exports.responseJSONMapper = void 0;
const tslib_1 = require("tslib");
const HttpException_1 = require("../exceptions/HttpException");
const multer_1 = tslib_1.__importDefault(require("multer"));
const constants_1 = require("./constants");
const responseJSONMapper = (res, statusCode, data, message) => {
    res.status(statusCode).json({ data, message: message || '' });
};
exports.responseJSONMapper = responseJSONMapper;
// @ts-ignore
const uploadFileFilter = (req, file, cb) => {
    if (file.mimetype.match(/(image\/jpeg|image\/png|image\/heif|image\/tiff|image\/webp|image\/x-panasonic-raw)$/)) {
        cb(null, true);
    }
    else {
        cb(new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.incorrect_img_format), false);
    }
};
exports.fileUploadCB = (0, multer_1.default)({ storage: multer_1.default.memoryStorage(), fileFilter: uploadFileFilter, limits: { fileSize: constants_1.FILE_LIMIT } }).single('image');
//# sourceMappingURL=global.js.map