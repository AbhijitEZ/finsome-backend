"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
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
const userSuggestionImprovementModel = (0, mongoose_1.model)(constants_1.USER_SUGGESTION_IMPROVEMENTS, userSuggestionImprovement);
exports.default = userSuggestionImprovementModel;
//# sourceMappingURL=user-suggestion-improvement.js.map