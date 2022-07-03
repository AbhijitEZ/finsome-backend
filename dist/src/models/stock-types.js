"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../../utils/constants");
const stockTypeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    /* Only for the equity */
    country_code: {
        type: String,
    },
    s_type: {
        type: String,
        enum: Object.keys(constants_1.STOCK_TYPE_CONST),
        required: true,
    },
    image: {
        type: String,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
const stockTypeModel = (0, mongoose_1.model)(constants_1.STOCK_TYPES, stockTypeSchema);
exports.default = stockTypeModel;
//# sourceMappingURL=stock-types.js.map