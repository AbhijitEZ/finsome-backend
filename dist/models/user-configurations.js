"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = tslib_1.__importDefault(require("mongoose-paginate-v2"));
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
    account_type: {
        type: String,
        enum: Object.keys(constants_1.ACCOUNT_TYPE_CONST),
        default: constants_1.ACCOUNT_TYPE_CONST.PUBLIC,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
userConfigurationSchema.plugin(mongoose_paginate_v2_1.default);
const userConfigurationModel = (0, mongoose_1.model)(constants_1.USER_CONFIGURATIONS, userConfigurationSchema);
exports.default = userConfigurationModel;
//# sourceMappingURL=user-configurations.js.map