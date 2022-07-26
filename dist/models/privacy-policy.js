"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = tslib_1.__importDefault(require("mongoose-paginate-v2"));
const constants_1 = require("../utils/constants");
const privacyPolicySchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
privacyPolicySchema.plugin(mongoose_paginate_v2_1.default);
const privacyPolicyModel = (0, mongoose_1.model)(constants_1.PRIVACY_POLICIES, privacyPolicySchema);
exports.default = privacyPolicyModel;
//# sourceMappingURL=privacy-policy.js.map