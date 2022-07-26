"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = tslib_1.__importDefault(require("mongoose-paginate-v2"));
const constants_1 = require("../utils/constants");
const countrySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        require: true,
    },
    emoji: {
        type: String,
    },
    image: {
        type: String,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
countrySchema.plugin(mongoose_paginate_v2_1.default);
const countryModel = (0, mongoose_1.model)(constants_1.COUNTRIES, countrySchema);
exports.default = countryModel;
//# sourceMappingURL=countries.js.map