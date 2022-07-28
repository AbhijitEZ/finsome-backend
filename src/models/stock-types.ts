import { model, Schema, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
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
      enum: Object.keys(STOCK_TYPE_CONST),
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

stockTypeSchema.plugin(paginate);
stockTypeSchema.plugin(aggregatePaginate);
const stockTypeModel = model<StockTypeInf & Document>(STOCK_TYPES, stockTypeSchema);

export default stockTypeModel;
