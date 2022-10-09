"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = tslib_1.__importDefault(require("mongoose-paginate-v2"));
const constants_1 = require("../utils/constants");
const articleCatSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.USERS,
        default: null
    },
    name: {
        type: String,
    },
    sequence: {
        type: Number,
        default: 0
    },
    deleted_at: {
        type: Date,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
articleCatSchema.plugin(mongoose_paginate_v2_1.default);
const articleCatModel = (0, mongoose_1.model)(constants_1.ARTICLE_CATEGORIES, articleCatSchema);
exports.default = articleCatModel;
//# sourceMappingURL=article-categories.js.map