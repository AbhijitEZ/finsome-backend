"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
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
const quickContactModel = (0, mongoose_1.model)('quick-contact', quickContactSchema);
exports.default = quickContactModel;
//# sourceMappingURL=quick-contact.js.map