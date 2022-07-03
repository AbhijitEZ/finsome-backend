"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("@/utils/constants");
const deviceTokenSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.USERS,
    },
    device_token: {
        type: String,
    },
    platform: {
        type: String,
    },
    revoked: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
const deviceTokenModel = (0, mongoose_1.model)(constants_1.DEVICE_TOKENS, deviceTokenSchema);
exports.default = deviceTokenModel;
//# sourceMappingURL=device-tokens.js.map