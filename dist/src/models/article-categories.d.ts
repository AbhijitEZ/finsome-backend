import { Document } from 'mongoose';
import { ArticleCategoryInf } from '@interfaces/general.interface';
declare const articleCatModel: import("mongoose").Model<ArticleCategoryInf & Document<any, any, any>, {}, {}>;
export default articleCatModel;
