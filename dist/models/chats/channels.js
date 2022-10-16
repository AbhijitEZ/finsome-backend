"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = tslib_1.__importDefault(require("mongoose-paginate-v2"));
const constants_1 = require("../../utils/constants");
const timeDurationArray = new mongoose_1.Schema({
    duration: {
        type: String,
        enum: ["1 Month", "3 Months", "6 Months", "1 Year"]
    },
    amount: { type: Number }
}, { _id: false });
const userArray = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    role: {
        type: String,
        enum: ["Admin", "SubAdmin", "Normal"],
        default: "Admin"
    }
}, { _id: false });
const channelSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    channelImage: {
        type: String,
        default: ""
    },
    users: [userArray],
    subscriptions: [timeDurationArray],
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.USERS,
        required: true
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
channelSchema.plugin(mongoose_paginate_v2_1.default);
const channelModel = (0, mongoose_1.model)(constants_1.CHANNELS, channelSchema);
exports.default = channelModel;
//# sourceMappingURL=channels.js.map