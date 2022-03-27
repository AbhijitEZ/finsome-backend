import { model, Schema, Document } from 'mongoose';
import { QuickContactInf } from '@interfaces/general.interface';

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

const quickContactModel = model<QuickContactInf & Document>('quick-contact', quickContactSchema);

export default quickContactModel;
