"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("@/utils/constants");
const appImprovementSchema = new mongoose_1.Schema({
    name: {
        type: String,
    },
});
const appImprovementModel = (0, mongoose_1.model)(constants_1.APP_IMPROVEMENT_TYPES, appImprovementSchema);
exports.default = appImprovementModel;
//# sourceMappingURL=app-improvement-type.js.map