"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateConstSwitcherHandler = exports.commentResponseMapper = exports.postResponseMapper = exports.userResponseFilter = exports.fileUploadPostCB = exports.fileUploadCSVCB = exports.fileUploadCB = exports.responseJSONMapper = void 0;
const tslib_1 = require("tslib");
const HttpException_1 = require("../exceptions/HttpException");
const multer_1 = tslib_1.__importDefault(require("multer"));
const os_1 = tslib_1.__importDefault(require("os"));
const constants_1 = require("./constants");
const util_1 = require("./util");
const date_fns_timezone_1 = require("date-fns-timezone");
const date_fns_1 = require("date-fns");
const responseJSONMapper = (res, statusCode, data, message) => {
    res.status(statusCode).json({ data, message: message || '' });
};
exports.responseJSONMapper = responseJSONMapper;
// @ts-ignore
const uploadCSVFileFilter = (req, file, cb) => {
    if (file.mimetype.match(/(text\/csv)$/)) {
        cb(null, true);
    }
    else {
        cb(new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.incorrect_csv_format), false);
    }
};
// @ts-ignore
const uploadFileFilter = (req, file, cb) => {
    if (file.mimetype.match(/(image\/jpeg|image\/png|image\/heif|image\/tiff|image\/webp|image\/x-panasonic-raw)$/)) {
        cb(null, true);
    }
    else {
        cb(new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.incorrect_img_format), false);
    }
};
// @ts-ignore
const uploadPostFileFilter = (req, file, cb) => {
    if (file.mimetype.match(/(image\/jpeg|image\/png|image\/heif|image\/tiff|image\/webp|image\/x-panasonic-raw|video\/mp4|application\/x-mpegURL|video\/quicktime|video\/MP2T|video\/3gpp|video\/x-msvideo|video\/x-ms-wmv)$/)) {
        cb(null, true);
    }
    else {
        cb(new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.incorrect_format), false);
    }
};
exports.fileUploadCB = (0, multer_1.default)({ storage: multer_1.default.memoryStorage(), fileFilter: uploadFileFilter, limits: { fileSize: constants_1.FILE_LIMIT } }).single('image');
exports.fileUploadCSVCB = (0, multer_1.default)({ dest: os_1.default.tmpdir(), fileFilter: uploadCSVFileFilter, limits: { fileSize: constants_1.FILE_LIMIT } }).single('document');
exports.fileUploadPostCB = (0, multer_1.default)({ dest: os_1.default.tmpdir(), fileFilter: uploadPostFileFilter }).fields([
    { name: 'post_images', maxCount: constants_1.FILE_COUNT_POST },
    { name: 'post_vids', maxCount: constants_1.FILE_COUNT_POST },
    { name: 'post_thumbs', maxCount: constants_1.FILE_COUNT_POST },
]);
const userResponseFilter = (userData) => {
    const user = Object.assign({}, userData);
    delete user.password;
    delete user.term_agree_timestamp;
    delete user.updated_at;
    if (user.profile_photo) {
        user.profile_photo = (0, util_1.profileImageGenerator)(user.profile_photo);
    }
    return user;
};
exports.userResponseFilter = userResponseFilter;
const postResponseMapper = (postData) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const post = Object.assign({}, postData);
    // @ts-ignore
    if ((_a = post === null || post === void 0 ? void 0 : post.user) === null || _a === void 0 ? void 0 : _a.profile_photo) {
        // @ts-ignore
        post.user.profile_photo = (0, util_1.profileImageGenerator)(post.user.profile_photo);
    }
    if (post === null || post === void 0 ? void 0 : post.created_at_tz) {
        post.created_at_tz = (0, util_1.dateFormatter)(post.created_at_tz);
    }
    if ((_b = post.post_images) === null || _b === void 0 ? void 0 : _b.length) {
        post.post_images = (_c = post.post_images) === null || _c === void 0 ? void 0 : _c.map(img => (0, util_1.postAssetsGenerator)(img));
    }
    if ((_d = post.post_thumbs) === null || _d === void 0 ? void 0 : _d.length) {
        post.post_thumbs = (_e = post.post_thumbs) === null || _e === void 0 ? void 0 : _e.map(img => (0, util_1.postAssetsGenerator)(img));
    }
    if ((_f = post.post_vids) === null || _f === void 0 ? void 0 : _f.length) {
        post.post_vids = (_g = post.post_vids) === null || _g === void 0 ? void 0 : _g.map(vid => (0, util_1.postAssetsGenerator)(vid));
    }
    return post;
};
exports.postResponseMapper = postResponseMapper;
const commentResponseMapper = (comment) => {
    var _a, _b;
    if (comment.created_at_tz) {
        comment.created_at_tz = (0, util_1.dateFormatter)(comment.created_at_tz);
    }
    if ((_a = comment === null || comment === void 0 ? void 0 : comment.user) === null || _a === void 0 ? void 0 : _a.profile_photo) {
        comment.user.profile_photo = (0, util_1.profileImageGenerator)((_b = comment === null || comment === void 0 ? void 0 : comment.user) === null || _b === void 0 ? void 0 : _b.profile_photo);
    }
    if (comment.reply) {
        comment.reply = comment.reply.map(data => {
            var _a;
            return (Object.assign(Object.assign({}, data), { created_at_tz: data.created_at_tz ? (0, util_1.dateFormatter)(data.created_at_tz) : undefined, 
                // @ts-ignore
                reply_user: (data === null || data === void 0 ? void 0 : data.reply_user) ? Object.assign(Object.assign({}, data.reply_user), { profile_photo: (0, util_1.profileImageGenerator)((_a = data.reply_user) === null || _a === void 0 ? void 0 : _a.profile_photo) }) : {} }));
        });
    }
    return comment;
};
exports.commentResponseMapper = commentResponseMapper;
const dateConstSwitcherHandler = (dateConst) => {
    let start = new Date();
    const end = (0, date_fns_1.endOfDay)((0, date_fns_timezone_1.convertToLocalTime)((0, date_fns_1.toDate)(new Date()), { timeZone: constants_1.DEFAULT_TIMEZONE }));
    switch (dateConst) {
        case constants_1.DATE_FILTER_TYPE_CONST.TODAY:
            start = (0, date_fns_1.startOfDay)((0, date_fns_timezone_1.convertToLocalTime)((0, date_fns_1.toDate)(start), { timeZone: constants_1.DEFAULT_TIMEZONE }));
            break;
        case constants_1.DATE_FILTER_TYPE_CONST.LAST2DAY:
            start = (0, date_fns_1.sub)((0, date_fns_1.startOfDay)((0, date_fns_timezone_1.convertToLocalTime)((0, date_fns_1.toDate)(start), { timeZone: constants_1.DEFAULT_TIMEZONE })), {
                days: 2,
            });
            break;
        case constants_1.DATE_FILTER_TYPE_CONST.WEEK:
            start = (0, date_fns_1.sub)((0, date_fns_1.startOfDay)((0, date_fns_timezone_1.convertToLocalTime)((0, date_fns_1.toDate)(start), { timeZone: constants_1.DEFAULT_TIMEZONE })), {
                weeks: 1,
            });
            break;
        case constants_1.DATE_FILTER_TYPE_CONST.MONTH:
            start = (0, date_fns_1.sub)((0, date_fns_1.startOfDay)((0, date_fns_timezone_1.convertToLocalTime)((0, date_fns_1.toDate)(start), { timeZone: constants_1.DEFAULT_TIMEZONE })), {
                months: 1,
            });
            break;
        default:
            start = (0, date_fns_1.startOfDay)((0, date_fns_timezone_1.convertToLocalTime)((0, date_fns_1.toDate)(start), { timeZone: constants_1.DEFAULT_TIMEZONE }));
            break;
    }
    return { start, end };
};
exports.dateConstSwitcherHandler = dateConstSwitcherHandler;
//# sourceMappingURL=global.js.map