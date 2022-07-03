import { model, Schema, Document } from 'mongoose';
import { ArticleCategoryInf } from '@interfaces/general.interface';
import { ARTICLE_CATEGORIES, USERS } from '@/utils/constants';

const articleCatSchema: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: USERS,
    },
    name: {
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

const articleCatModel = model<ArticleCategoryInf & Document>(ARTICLE_CATEGORIES, articleCatSchema);

export default articleCatModel;
