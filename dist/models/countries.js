"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
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
const countryModel = (0, mongoose_1.model)(constants_1.COUNTRIES, countrySchema);
exports.default = countryModel;
//# sourceMappingURL=countries.js.map