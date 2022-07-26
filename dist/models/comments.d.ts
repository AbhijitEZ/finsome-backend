/// <reference types="mongoose-paginate-v2" />
import { Document } from 'mongoose';
import { CommentsInf } from '../interfaces/general.interface';
declare const commentsModel: import("mongoose").Model<CommentsInf & Document<any, any, any>, {}, {}>;
export default commentsModel;
