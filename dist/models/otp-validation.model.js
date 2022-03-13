"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
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
    deleted_at: {
        type: Date,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
const otpValidationModel = (0, mongoose_1.model)('otp-validation', otpValidationSchema);
exports.default = otpValidationModel;
//# sourceMappingURL=otp-validation.model.js.map