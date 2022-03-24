import { model, Schema, Document } from 'mongoose';
import { AppImprovementInf } from '@interfaces/general.interface';
import { APP_IMPROVEMENT_TYPES } from '@/utils/constants';

const appImprovementSchema: Schema = new Schema({
  name: {
    type: String,
  },
});

const appImprovementModel = model<AppImprovementInf & Document>(APP_IMPROVEMENT_TYPES, appImprovementSchema);

export default appImprovementModel;
