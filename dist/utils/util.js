"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.includeDeletedAtMatch = exports.listingResponseSanitize = exports.dateFormatter = exports.fileUnSyncFromLocalStroage = exports.postAssetsGenerator = exports.profileImageGenerator = exports.isEmpty = void 0;
const tslib_1 = require("tslib");
const date_fns_1 = require("date-fns");
const fs_1 = tslib_1.__importDefault(require("fs"));
const constants_1 = require("./constants");
const logger_1 = require("./logger");
/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
const isEmpty = (value) => {
    if (value === null) {
        return true;
    }
    else if (typeof value !== 'number' && value === '') {
        return true;
    }
    else if (typeof value === 'undefined' || value === undefined) {
        return true;
    }
    else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
        return true;
    }
    else {
        return false;
    }
};
exports.isEmpty = isEmpty;
const profileImageGenerator = (imageName) => {
    return imageName ? `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${constants_1.profileImageFolder}${imageName}` : null;
};
exports.profileImageGenerator = profileImageGenerator;
const postAssetsGenerator = (imageName) => {
    return imageName ? `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${constants_1.postAssetsFolder}${imageName}` : null;
};
exports.postAssetsGenerator = postAssetsGenerator;
const fileUnSyncFromLocalStroage = (path) => {
    fs_1.default.unlink(path, err => {
        if (err) {
            logger_1.logger.error('ERROR while unlinking file from the temp ' + path);
            console.log(err);
        }
        logger_1.logger.info('Removal of file from temp location in server: ' + path);
    });
};
exports.fileUnSyncFromLocalStroage = fileUnSyncFromLocalStroage;
const dateFormatter = (date) => {
    return (0, date_fns_1.format)((0, date_fns_1.parseISO)(date), 'yyyy-MM-dd hh:mm aaa');
};
exports.dateFormatter = dateFormatter;
const listingResponseSanitize = (data) => {
    var _a, _b, _c, _d, _e, _f;
    const total_count = (_d = (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data[0]) === null || _a === void 0 ? void 0 : _a.totalRecords) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.total) !== null && _d !== void 0 ? _d : 0;
    let result = (_f = (_e = data === null || data === void 0 ? void 0 : data[0]) === null || _e === void 0 ? void 0 : _e.result) !== null && _f !== void 0 ? _f : [];
    result = result.map(data => {
        var _a, _b, _c;
        if ((_a = data === null || data === void 0 ? void 0 : data.user_detail) === null || _a === void 0 ? void 0 : _a.profile_photo) {
            data.user_detail.profile_photo = (0, exports.profileImageGenerator)(data.user_detail.profile_photo);
        }
        if ((_b = data === null || data === void 0 ? void 0 : data.follower_detail) === null || _b === void 0 ? void 0 : _b.profile_photo) {
            data.follower_detail.profile_photo = (0, exports.profileImageGenerator)(data.follower_detail.profile_photo);
        }
        if ((_c = data === null || data === void 0 ? void 0 : data.following_detail) === null || _c === void 0 ? void 0 : _c.profile_photo) {
            data.following_detail.profile_photo = (0, exports.profileImageGenerator)(data.following_detail.profile_photo);
        }
        if (data === null || data === void 0 ? void 0 : data.created_at_tz) {
            data.created_at_tz = (0, exports.dateFormatter)(data.created_at_tz);
        }
        if (data === null || data === void 0 ? void 0 : data.updated_at_tz) {
            data.updated_at_tz = (0, exports.dateFormatter)(data.updated_at_tz);
        }
        return Object.assign({}, data);
    });
    return {
        total_count,
        result,
    };
};
exports.listingResponseSanitize = listingResponseSanitize;
const includeDeletedAtMatch = (data) => {
    return Object.assign({ deleted_at: {
            $eq: null,
        } }, data);
};
exports.includeDeletedAtMatch = includeDeletedAtMatch;
//# sourceMappingURL=util.js.map