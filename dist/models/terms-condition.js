"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = tslib_1.__importDefault(require("mongoose-paginate-v2"));
const constants_1 = require("../utils/constants");
const termsConditionSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
termsConditionSchema.plugin(mongoose_paginate_v2_1.default);
const termsConditionModel = (0, mongoose_1.model)(constants_1.TERMS_CONDITIONS, termsConditionSchema);
exports.default = termsConditionModel;
//# sourceMappingURL=terms-condition.js.map