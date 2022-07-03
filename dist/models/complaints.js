"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const compliantsSchema = new mongoose_1.Schema({
    post_complain_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.POSTS,
        default: null,
    },
    user_complain_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.USERS,
        default: null,
    },
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.USERS,
    },
    reason: {
        type: String,
    },
    description: {
        type: String,
    },
    deleted_at: {
        type: Date,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
const complaintModel = (0, mongoose_1.model)(constants_1.COMPLAINTS, compliantsSchema);
exports.default = complaintModel;
//# sourceMappingURL=complaints.js.map