import { model, Schema, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { AppImprovementInf } from '@interfaces/general.interface';
import { APP_IMPROVEMENT_TYPES } from '@/utils/constants';

const appImprovementSchema: Schema = new Schema({
  name: {
    type: String,
  },
});
appImprovementSchema.plugin(paginate);
const appImprovementModel = model<AppImprovementInf & Document>(APP_IMPROVEMENT_TYPES, appImprovementSchema);

export default appImprovementModel;
