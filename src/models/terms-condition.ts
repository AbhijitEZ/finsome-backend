import { model, Schema, Document } from 'mongoose';
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

const termsConditionModel = model<PrivacyPolicyInf & Document>(TERMS_CONDITIONS, termsConditionSchema);

export default termsConditionModel;
