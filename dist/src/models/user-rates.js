"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("@/utils/constants");
const userRates = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.USERS,
    },
    rated_by_user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.USERS,
    },
    rate: {
        type: Number,
    },
    comment: {
        type: String,
    },
    deleted_at: {
        type: Date,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
const userRatesModel = (0, mongoose_1.model)(constants_1.USER_RATES, userRates);
exports.default = userRatesModel;
//# sourceMappingURL=user-rates.js.map