import { Document } from 'mongoose';
import { PostsInf } from '../interfaces/general.interface';
declare const postsModel: import("mongoose").Model<PostsInf & Document<any, any, any>, {}, {}>;
export default postsModel;
