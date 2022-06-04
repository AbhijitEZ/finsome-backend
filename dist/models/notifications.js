"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
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
    meta_data: {
        type: Object,
    },
    deleted_at: {
        type: Date,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
const notificationModel = (0, mongoose_1.model)(constants_1.NOTFICATIONS, notificationsSchema);
exports.default = notificationModel;
//# sourceMappingURL=notifications.js.map