import { model, Schema, Document } from 'mongoose';
import { ComplaintsInf } from '@interfaces/general.interface';
import { COMPLAINTS, POSTS, USERS } from '@/utils/constants';

const compliantsSchema: Schema = new Schema(
  {
    post_complain_id: {
      type: Schema.Types.ObjectId,
      ref: POSTS,
      default: null,
    },
    user_complain_id: {
      type: Schema.Types.ObjectId,
      ref: USERS,
      default: null,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: USERS,
    },
    reason: {
      type: String,
    },
    description: {
      type: String,
    },
    deleted_at: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

const complaintModel = model<ComplaintsInf & Document>(COMPLAINTS, compliantsSchema);

export default complaintModel;
