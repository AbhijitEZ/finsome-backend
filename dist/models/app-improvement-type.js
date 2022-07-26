"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = tslib_1.__importDefault(require("mongoose-paginate-v2"));
const constants_1 = require("../utils/constants");
const appImprovementSchema = new mongoose_1.Schema({
    name: {
        type: String,
    },
});
appImprovementSchema.plugin(mongoose_paginate_v2_1.default);
const appImprovementModel = (0, mongoose_1.model)(constants_1.APP_IMPROVEMENT_TYPES, appImprovementSchema);
exports.default = appImprovementModel;
//# sourceMappingURL=app-improvement-type.js.map