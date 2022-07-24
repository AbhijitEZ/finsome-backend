import { model, Schema, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { PostsInf } from '@interfaces/general.interface';
import { ANALYSIS_TYPE_CONST, POSTS, STOCK_RECOMMENDED_CONST, STOCK_TYPES, STOCK_TYPE_CONST, TRADE_TYPE_CONST, USERS } from '@/utils/constants';

const postsSch: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: USERS,
    },
    /* Stock/Equity id */
    security_id: {
      type: Schema.Types.ObjectId,
      ref: STOCK_TYPES,
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
    is_recommended: {
      type: Boolean,
      default: false,
    },
    buy_recommend_amount: {
      type: String,
    },
    sell_recommend_amount: {
      type: String,
    },
    caption: {
      type: String,
    },
    post_images: [
      {
        type: String,
      },
    ],
    post_thumbs: [
      {
        type: String,
      },
    ],
    post_vids: [
      {
        type: String,
      },
    ],
    deleted_at: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

postsSch.plugin(paginate);
const postsModel = model<PostsInf & Document>(POSTS, postsSch);

export default postsModel;
