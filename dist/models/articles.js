"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = tslib_1.__importDefault(require("mongoose-paginate-v2"));
const constants_1 = require("../utils/constants");
const articleSchema = new mongoose_1.Schema({
    coverImage: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: '',
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.ARTICLE_CATEGORIES,
    },
    description: {
        type: String,
        default: '',
    },
    readingTime: {
        type: String,
        default: '',
    },
    content: {
        type: String,
        default: '',
    },
    deleted_at: {
        type: Date,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
articleSchema.plugin(mongoose_paginate_v2_1.default);
const articleModel = (0, mongoose_1.model)(constants_1.ARTICLES, articleSchema);
exports.default = articleModel;
//# sourceMappingURL=articles.js.map