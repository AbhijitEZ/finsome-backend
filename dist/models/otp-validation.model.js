"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = tslib_1.__importDefault(require("mongoose-paginate-v2"));
const constants_1 = require("../utils/constants");
const otpValidationSchema = new mongoose_1.Schema({
    phone_country_code: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        require: true,
    },
    confirmed: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
otpValidationSchema.plugin(mongoose_paginate_v2_1.default);
const otpValidationModel = (0, mongoose_1.model)(constants_1.OTP_VALIDATIONS, otpValidationSchema);
exports.default = otpValidationModel;
//# sourceMappingURL=otp-validation.model.js.map