"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const userConfigurationSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.USERS,
    },
    stock_type: {
        type: String,
        enum: Object.keys(constants_1.STOCK_TYPE_CONST),
    },
    analysis_type: {
        type: String,
        enum: Object.keys(constants_1.ANALYSIS_TYPE_CONST),
    },
    trade_type: {
        type: String,
        enum: Object.keys(constants_1.TRADE_TYPE_CONST),
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
const userConfigurationModel = (0, mongoose_1.model)(constants_1.USER_CONFIGURATIONS, userConfigurationSchema);
exports.default = userConfigurationModel;
//# sourceMappingURL=user-configurations.js.map