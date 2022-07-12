import { model, Schema, Document } from 'mongoose';
import { NotificationSubscriptionInf } from '@interfaces/general.interface';
import { USERS, NOTIFICATION_SUBSCRIPTION } from '@/utils/constants';

const notificationSubscriptionSchema: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: USERS,
    },
    subscriber_id: {
      type: Schema.Types.ObjectId,
      ref: USERS,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

const notificationSubscriptionModel = model<NotificationSubscriptionInf & Document>(NOTIFICATION_SUBSCRIPTION, notificationSubscriptionSchema);

export default notificationSubscriptionModel;
