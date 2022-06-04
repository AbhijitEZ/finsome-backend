import { model, Schema, Document } from 'mongoose';
import { NotificationInf } from '@interfaces/general.interface';
import { NOTFICATIONS, USERS } from '@/utils/constants';

const notificationsSchema: Schema = new Schema(
  {
    /* notification send to user */
    user_id: {
      type: Schema.Types.ObjectId,
      ref: USERS,
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
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

const notificationModel = model<NotificationInf & Document>(NOTFICATIONS, notificationsSchema);

export default notificationModel;
