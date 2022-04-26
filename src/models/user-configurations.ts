import { model, Schema, Document } from 'mongoose';
import { UserConfigurationInf } from '@interfaces/general.interface';
import { ANALYSIS_TYPE_CONST, STOCK_TYPE_CONST, TRADE_TYPE_CONST, USERS, USER_CONFIGURATIONS } from '@/utils/constants';

const userConfigurationSchema: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: USERS,
    },
    stock_type: {
      type: String,
      enum: Object.keys(STOCK_TYPE_CONST),
    },
    analysis_type: {
      type: String,
      enum: Object.keys(ANALYSIS_TYPE_CONST),
    },
    trade_type: {
      type: String,
      enum: Object.keys(TRADE_TYPE_CONST),
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

const userConfigurationModel = model<UserConfigurationInf & Document>(USER_CONFIGURATIONS, userConfigurationSchema);

export default userConfigurationModel;
