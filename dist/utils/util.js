"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileImageGenerator = exports.isEmpty = void 0;
const constants_1 = require("./constants");
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
//# sourceMappingURL=util.js.map