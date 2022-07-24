import { model, Schema, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { PrivacyPolicyInf } from '@interfaces/general.interface';
import { TERMS_CONDITIONS } from '@/utils/constants';

const termsConditionSchema: Schema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

termsConditionSchema.plugin(paginate);
const termsConditionModel = model<PrivacyPolicyInf & Document>(TERMS_CONDITIONS, termsConditionSchema);

export default termsConditionModel;
