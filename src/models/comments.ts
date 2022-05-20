import { model, Schema, Document } from 'mongoose';
import { CommentsInf } from '@interfaces/general.interface';
import { COMMENTS, POSTS, USERS } from '@/utils/constants';

const commentsSchema: Schema = new Schema(
  {
    post_id: {
      type: Schema.Types.ObjectId,
      ref: POSTS,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: USERS,
    },
    parent_id: {
      type: Schema.Types.ObjectId,
      ref: COMMENTS,
      default: null,
    },
    message: {
      type: String,
    },
    deleted_at: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

const commentsModel = model<CommentsInf & Document>(COMMENTS, commentsSchema);

export default commentsModel;
