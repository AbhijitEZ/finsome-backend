import { Document } from 'mongoose';
import { LikesInf } from '../interfaces/general.interface';
declare const likesModel: import("mongoose").Model<LikesInf & Document<any, any, any>, {}, {}>;
export default likesModel;
