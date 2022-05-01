import { model, Schema, Document } from 'mongoose';
import { PostsInf } from '@interfaces/general.interface';
import { ANALYSIS_TYPE_CONST, POSTS, STOCK_RECOMMENDED_CONST, STOCK_TYPE_CONST, TRADE_TYPE_CONST, USERS } from '@/utils/constants';

const postsSch: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: USERS,
    },
    stock_type: {
      type: String,
      enum: Object.keys(STOCK_TYPE_CONST),
    },
    analysis_type: {
      type: String,
      enum: Object.keys(ANALYSIS_TYPE_CONST),
    },
    trade_type: {
      type: String,
      enum: Object.keys(TRADE_TYPE_CONST),
    },
    stock_recommended_type: {
      type: String,
      enum: Object.keys(STOCK_RECOMMENDED_CONST),
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

const postsModel = model<PostsInf & Document>(POSTS, postsSch);

export default postsModel;
