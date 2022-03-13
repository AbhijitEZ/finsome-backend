"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const aws_sdk_1 = tslib_1.__importDefault(require("aws-sdk"));
const nanoid_1 = require("nanoid");
const constants_1 = require("./constants");
const logger_1 = require("./logger");
class AWSHandler {
    constructor() {
        console.log('************* AWS Initialized *************');
    }
    init() {
        aws_sdk_1.default.config.update({
            apiVersion: 'latest',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY,
                expired: false,
            },
            region: process.env.AWS_REGION,
        });
    }
    deleteProfileImage(profilePhoto) {
        const s3 = new aws_sdk_1.default.S3();
        s3.deleteObject({ Bucket: process.env.S3_BUCKET, Key: constants_1.profileImageFolder + profilePhoto })
            .promise()
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .catch(error => {
            logger_1.logger.info(constants_1.APP_ERROR_MESSAGE.delete_s3_error);
        });
    }
    async addProfileImage(file) {
        const imageName = (0, nanoid_1.nanoid)(12) + '_' + file.originalname;
        const s3 = new aws_sdk_1.default.S3();
        const uploadOptions = {
            Bucket: process.env.S3_BUCKET,
            Key: constants_1.profileImageFolder + imageName,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        };
        await s3
            .upload(uploadOptions)
            .promise()
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .catch(error => {
            console.log(error, 'error');
            logger_1.logger.info(constants_1.APP_ERROR_MESSAGE.add_s3_error);
        });
        return imageName;
    }
}
exports.default = new AWSHandler();
//# sourceMappingURL=aws.js.map