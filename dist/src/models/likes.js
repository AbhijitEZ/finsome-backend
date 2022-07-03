"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("@/utils/constants");
const likesSchema = new mongoose_1.Schema({
    post_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.POSTS,
    },
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.USERS,
    },
    deleted_at: {
        type: Date,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
const likesModel = (0, mongoose_1.model)(constants_1.LIKES, likesSchema);
exports.default = likesModel;
//# sourceMappingURL=likes.js.map