import { model, Schema, Document } from 'mongoose';
import { UserRateInf } from '@interfaces/general.interface';
import { USERS, USER_RATES } from '@/utils/constants';

const userRates: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: USERS,
    },
    rated_by_user: {
      type: Schema.Types.ObjectId,
      ref: USERS,
    },
    rate: {
      type: Number,
    },
    comment: {
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

const userRatesModel = model<UserRateInf & Document>(USER_RATES, userRates);

export default userRatesModel;
