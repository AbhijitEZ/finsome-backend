import { model, Schema, Document } from 'mongoose';
import { UserFollowerInf } from '@interfaces/general.interface';
import { USERS, USER_FOLLOWERS } from '@/utils/constants';

const userFollowerSchema: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: USERS,
    },
    follower_id: {
      type: Schema.Types.ObjectId,
      ref: USERS,
    },
    accepted: {
      type: Boolean,
      default: false,
    },
    deleted_at: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

const userFollowerModel = model<UserFollowerInf & Document>(USER_FOLLOWERS, userFollowerSchema);

export default userFollowerModel;
