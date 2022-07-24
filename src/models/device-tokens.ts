import { model, Schema, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { DEVICE_TOKENS, USERS } from '@/utils/constants';
import { DeviceTokenInf } from '@/interfaces/users.interface';

const deviceTokenSchema: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: USERS,
    },
    device_token: {
      type: String,
    },
    platform: {
      type: String,
    },
    revoked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);
deviceTokenSchema.plugin(paginate);
const deviceTokenModel = model<DeviceTokenInf & Document>(DEVICE_TOKENS, deviceTokenSchema);

export default deviceTokenModel;
