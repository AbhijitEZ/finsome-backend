import { model, Schema, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { CountryInf } from '@interfaces/general.interface';
import { COUNTRIES } from '@/utils/constants';

const countrySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      require: true,
    },
    emoji: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

countrySchema.plugin(paginate);
const countryModel = model<CountryInf & Document>(COUNTRIES, countrySchema);

export default countryModel;
