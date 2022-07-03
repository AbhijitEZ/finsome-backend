"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../../utils/constants");
const privacyPolicySchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
const privacyPolicyModel = (0, mongoose_1.model)(constants_1.PRIVACY_POLICIES, privacyPolicySchema);
exports.default = privacyPolicyModel;
//# sourceMappingURL=privacy-policy.js.map