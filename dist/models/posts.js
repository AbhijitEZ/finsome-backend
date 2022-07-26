"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = tslib_1.__importDefault(require("mongoose-paginate-v2"));
const mongoose_aggregate_paginate_v2_1 = tslib_1.__importDefault(require("mongoose-aggregate-paginate-v2"));
const constants_1 = require("../utils/constants");
const postsSch = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.USERS,
    },
    /* Stock/Equity id */
    security_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.STOCK_TYPES,
    },
    stock_type: {
        type: String,
        enum: Object.keys(constants_1.STOCK_TYPE_CONST),
    },
    analysis_type: {
        type: String,
        enum: Object.keys(constants_1.ANALYSIS_TYPE_CONST),
    },
    trade_type: {
        type: String,
        enum: Object.keys(constants_1.TRADE_TYPE_CONST),
    },
    stock_recommended_type: {
        type: String,
        enum: Object.keys(constants_1.STOCK_RECOMMENDED_CONST),
    },
    is_recommended: {
        type: Boolean,
        default: false,
    },
    buy_recommend_amount: {
        type: String,
    },
    sell_recommend_amount: {
        type: String,
    },
    caption: {
        type: String,
    },
    post_images: [
        {
            type: String,
        },
    ],
    post_thumbs: [
        {
            type: String,
        },
    ],
    post_vids: [
        {
            type: String,
        },
    ],
    deleted_at: {
        type: Date,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
postsSch.plugin(mongoose_paginate_v2_1.default);
postsSch.plugin(mongoose_aggregate_paginate_v2_1.default);
const postsModel = (0, mongoose_1.model)(constants_1.POSTS, postsSch);
exports.default = postsModel;
//# sourceMappingURL=posts.js.map