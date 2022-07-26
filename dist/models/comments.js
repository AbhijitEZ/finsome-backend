"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = tslib_1.__importDefault(require("mongoose-paginate-v2"));
const constants_1 = require("../utils/constants");
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
commentsSchema.plugin(mongoose_paginate_v2_1.default);
const commentsModel = (0, mongoose_1.model)(constants_1.COMMENTS, commentsSchema);
exports.default = commentsModel;
//# sourceMappingURL=comments.js.map