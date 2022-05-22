import { model, Schema, Document } from 'mongoose';
import { LikesInf } from '@interfaces/general.interface';
import { LIKES, POSTS, USERS } from '@/utils/constants';

const likesSchema: Schema = new Schema(
  {
    post_id: {
      type: Schema.Types.ObjectId,
      ref: POSTS,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: USERS,
    },
    deleted_at: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

const likesModel = model<LikesInf & Document>(LIKES, likesSchema);

export default likesModel;
