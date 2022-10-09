import { model, Schema, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { ArticleCategoryInf } from '@interfaces/general.interface';
import { ARTICLE_CATEGORIES, ARTICLES, USERS } from '@/utils/constants';

const articleSchema: Schema = new Schema(
  {
    coverImage:{
        type: String,
        default: ''
    },
    title: {
      type: String,
      default: '',
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: ARTICLE_CATEGORIES,
    },
    description: {
      type: String,
      default: '',
    },
    readingTime: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
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
articleSchema.plugin(paginate);
const articleModel = model(ARTICLES, articleSchema);

export default articleModel;
