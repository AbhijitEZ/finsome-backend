import { model, Schema, Document } from 'mongoose';
import { QuickContactInf } from '@interfaces/general.interface';
import { QUICK_CONTACTS } from '@/utils/constants';

const quickContactSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at' },
  },
);

const quickContactModel = model<QuickContactInf & Document>(QUICK_CONTACTS, quickContactSchema);

export default quickContactModel;
