import { model, Schema, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
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

privacyPolicySchema.plugin(paginate);
const privacyPolicyModel = model<PrivacyPolicyInf & Document>(PRIVACY_POLICIES, privacyPolicySchema);

export default privacyPolicyModel;
