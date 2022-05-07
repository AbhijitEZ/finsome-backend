"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUnSyncFromLocalStroage = exports.postAssetsGenerator = exports.profileImageGenerator = exports.isEmpty = void 0;
const tslib_1 = require("tslib");
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
//# sourceMappingURL=util.js.map