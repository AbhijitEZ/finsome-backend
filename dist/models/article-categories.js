"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const articleCatSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.USERS,
    },
    name: {
        type: String,
    },
    deleted_at: {
        type: Date,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
const articleCatModel = (0, mongoose_1.model)(constants_1.ARTICLE_CATEGORIES, articleCatSchema);
exports.default = articleCatModel;
//# sourceMappingURL=article-categories.js.map