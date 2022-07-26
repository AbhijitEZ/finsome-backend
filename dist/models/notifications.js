"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = tslib_1.__importDefault(require("mongoose-paginate-v2"));
const constants_1 = require("../utils/constants");
const notificationsSchema = new mongoose_1.Schema({
    /* notification send to user */
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.USERS,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: Object.keys(constants_1.NOTIFICATION_TYPE_CONST),
        default: constants_1.NOTIFICATION_TYPE_CONST.FOLLOW,
    },
    is_read: {
        type: Boolean,
        default: false,
    },
    meta_data: {
        type: Object,
    },
    deleted_at: {
        type: Date,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
notificationsSchema.plugin(mongoose_paginate_v2_1.default);
const notificationModel = (0, mongoose_1.model)(constants_1.NOTFICATIONS, notificationsSchema);
exports.default = notificationModel;
//# sourceMappingURL=notifications.js.map