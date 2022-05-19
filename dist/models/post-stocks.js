"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const postStockSchema = new mongoose_1.Schema({
    post_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.POSTS,
    },
    stock_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.STOCK_TYPES,
    },
    deleted_at: {
        type: Date,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
const postStockModel = (0, mongoose_1.model)(constants_1.POST_STOCKS, postStockSchema);
exports.default = postStockModel;
//# sourceMappingURL=post-stocks.js.map