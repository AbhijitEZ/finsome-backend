"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("@/utils/constants");
const commentsSchema = new mongoose_1.Schema({
    post_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.POSTS,
    },
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.USERS,
    },
    parent_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.COMMENTS,
        default: null,
    },
    message: {
        type: String,
    },
    deleted_at: {
        type: Date,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
const commentsModel = (0, mongoose_1.model)(constants_1.COMMENTS, commentsSchema);
exports.default = commentsModel;
//# sourceMappingURL=comments.js.map