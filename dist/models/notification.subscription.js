"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = tslib_1.__importDefault(require("mongoose-paginate-v2"));
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
notificationSubscriptionSchema.plugin(mongoose_paginate_v2_1.default);
const notificationSubscriptionModel = (0, mongoose_1.model)(constants_1.NOTIFICATION_SUBSCRIPTION, notificationSubscriptionSchema);
exports.default = notificationSubscriptionModel;
//# sourceMappingURL=notification.subscription.js.map