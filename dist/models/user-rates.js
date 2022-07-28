"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = tslib_1.__importDefault(require("mongoose-paginate-v2"));
const mongoose_aggregate_paginate_v2_1 = tslib_1.__importDefault(require("mongoose-aggregate-paginate-v2"));
const constants_1 = require("../utils/constants");
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
userRates.plugin(mongoose_paginate_v2_1.default);
userRates.plugin(mongoose_aggregate_paginate_v2_1.default);
const userRatesModel = (0, mongoose_1.model)(constants_1.USER_RATES, userRates);
exports.default = userRatesModel;
//# sourceMappingURL=user-rates.js.map