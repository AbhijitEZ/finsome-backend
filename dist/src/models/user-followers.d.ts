import { Document } from 'mongoose';
import { UserFollowerInf } from '@interfaces/general.interface';
declare const userFollowerModel: import("mongoose").Model<UserFollowerInf & Document<any, any, any>, {}, {}>;
export default userFollowerModel;
