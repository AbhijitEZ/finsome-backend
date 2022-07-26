"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = tslib_1.__importDefault(require("mongoose-paginate-v2"));
const constants_1 = require("../utils/constants");
const quickContactSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        require: true,
    },
}, {
    timestamps: { createdAt: 'created_at' },
});
quickContactSchema.plugin(mongoose_paginate_v2_1.default);
const quickContactModel = (0, mongoose_1.model)(constants_1.QUICK_CONTACTS, quickContactSchema);
exports.default = quickContactModel;
//# sourceMappingURL=quick-contact.js.map