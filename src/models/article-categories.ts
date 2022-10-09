import { model, Schema, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { ArticleCategoryInf } from '@interfaces/general.interface';
import { ARTICLE_CATEGORIES, USERS } from '@/utils/constants';

const articleCatSchema: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: USERS,
      default: null
    },
    name: {
      type: String,
    },
    sequence:{
      type: Number,
      default: 0
    },
    deleted_at: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);
articleCatSchema.plugin(paginate);
const articleCatModel = model<ArticleCategoryInf & Document>(ARTICLE_CATEGORIES, articleCatSchema);

export default articleCatModel;
