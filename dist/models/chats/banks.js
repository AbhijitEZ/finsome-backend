"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = tslib_1.__importDefault(require("mongoose-paginate-v2"));
const constants_1 = require("../../utils/constants");
const bankSchema = new mongoose_1.Schema({
    bankName: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        required: true
    },
    ifscCode: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.USERS,
        required: true
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
bankSchema.plugin(mongoose_paginate_v2_1.default);
const channelModel = (0, mongoose_1.model)(constants_1.BANKS, bankSchema);
exports.default = channelModel;
//# sourceMappingURL=banks.js.map