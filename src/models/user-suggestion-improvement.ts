import { model, Schema, Document } from 'mongoose';
import { UserSuggestionImproveInf } from '@interfaces/general.interface';
import { APP_IMPROVEMENT_TYPES, USERS, USER_SUGGESTION_IMPROVEMENTS } from '@/utils/constants';

const userSuggestionImprovement: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: USERS,
    },
    app_improve_type_id: {
      type: Schema.Types.ObjectId,
      ref: APP_IMPROVEMENT_TYPES,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: 'timestamp' },
  },
);

const userSuggestionImprovementModel = model<UserSuggestionImproveInf & Document>(USER_SUGGESTION_IMPROVEMENTS, userSuggestionImprovement);

export default userSuggestionImprovementModel;
