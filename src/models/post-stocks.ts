import { model, Schema, Document } from 'mongoose';
import { PostStocksInf } from '@interfaces/general.interface';
import { POSTS, POST_STOCKS, STOCK_TYPES } from '@/utils/constants';

const postStockSchema: Schema = new Schema(
  {
    post_id: {
      type: Schema.Types.ObjectId,
      ref: POSTS,
    },
    stock_id: {
      type: Schema.Types.ObjectId,
      ref: STOCK_TYPES,
    },
    deleted_at: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

const postStockModel = model<PostStocksInf & Document>(POST_STOCKS, postStockSchema);

export default postStockModel;
