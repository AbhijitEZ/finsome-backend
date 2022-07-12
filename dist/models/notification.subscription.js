"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const notificationSubscriptionSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.USERS,
    },
    subscriber_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.USERS,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
const notificationSubscriptionModel = (0, mongoose_1.model)(constants_1.NOTIFICATION_SUBSCRIPTION, notificationSubscriptionSchema);
exports.default = notificationSubscriptionModel;
//# sourceMappingURL=notification.subscription.js.map