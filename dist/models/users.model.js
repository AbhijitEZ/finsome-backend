"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const HttpException_1 = require("../exceptions/HttpException");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        index: {
            unique: true,
            partialFilterExpression: { email: { $type: 'string' } },
        },
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: Object.keys(constants_1.USER_ROLE),
        default: constants_1.USER_ROLE.MEMBER,
    },
    profile_photo: {
        type: String,
    },
    phone_country_code: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
        unique: true,
    },
    term_agree_timestamp: {
        type: Date,
        required: true,
    },
    username: {
        type: String,
    },
    fullname: {
        type: String,
    },
    birth_date: {
        type: Date,
    },
    trading_exp: {
        type: String,
    },
    gender: {
        type: String,
    },
    bio: {
        type: String,
    },
    youtube_link: {
        type: String,
    },
    instagram_link: {
        type: String,
    },
    telegram_link: {
        type: String,
    },
    is_registration_complete: {
        type: Boolean,
        default: false,
    },
    forgot_password_otp: {
        code: {
            type: String,
        },
        created_at: {
            type: Date,
        },
    },
    allow_notification: {
        type: Boolean,
        default: true,
    },
    deleted_at: {
        type: Date,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
userSchema.post('save', function (error, doc, next) {
    var _a;
    // Unqiue Email error handler
    if (error.name === 'MongoError' && error.code === 11000) {
        if ((_a = error.keyPattern) === null || _a === void 0 ? void 0 : _a.phone_number) {
            next(new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.phone_exists));
        }
        else {
            next(new HttpException_1.HttpException(409, constants_1.APP_ERROR_MESSAGE.email_exists));
        }
    }
    else {
        next(error);
    }
});
const userModel = (0, mongoose_1.model)(constants_1.USERS, userSchema);
exports.default = userModel;
//# sourceMappingURL=users.model.js.map