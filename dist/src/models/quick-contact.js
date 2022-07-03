"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../../utils/constants");
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
const quickContactModel = (0, mongoose_1.model)(constants_1.QUICK_CONTACTS, quickContactSchema);
exports.default = quickContactModel;
//# sourceMappingURL=quick-contact.js.map