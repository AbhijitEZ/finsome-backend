import { model, Schema, Document } from 'mongoose';
import { PrivacyPolicyInf } from '@interfaces/general.interface';
import { PRIVACY_POLICIES } from '@/utils/constants';

const privacyPolicySchema: Schema = new Schema(
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

const privacyPolicyModel = model<PrivacyPolicyInf & Document>(PRIVACY_POLICIES, privacyPolicySchema);

export default privacyPolicyModel;
