"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = tslib_1.__importDefault(require("mongoose-paginate-v2"));
const constants_1 = require("../utils/constants");
const userSuggestionImprovement = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.USERS,
    },
    app_improve_type_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.APP_IMPROVEMENT_TYPES,
    },
    description: {
        type: String,
    },
}, {
    timestamps: { createdAt: 'timestamp' },
});
userSuggestionImprovement.plugin(mongoose_paginate_v2_1.default);
const userSuggestionImprovementModel = (0, mongoose_1.model)(constants_1.USER_SUGGESTION_IMPROVEMENTS, userSuggestionImprovement);
exports.default = userSuggestionImprovementModel;
//# sourceMappingURL=user-suggestion-improvement.js.map