import { model, Schema, Document } from 'mongoose';
import { StockTypeInf } from '@interfaces/general.interface';
import { STOCK_TYPES, STOCK_TYPE_CONST } from '@/utils/constants';

const stockTypeSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    /* Only for the equity */
    country_code: {
      type: String,
    },
    s_type: {
      type: String,
      enum: [STOCK_TYPE_CONST.CRYPT, STOCK_TYPE_CONST.EQUITY],
      required: true,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

const stockTypeModel = model<StockTypeInf & Document>(STOCK_TYPES, stockTypeSchema);

export default stockTypeModel;
