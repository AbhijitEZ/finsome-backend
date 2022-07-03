import { Document } from 'mongoose';
import { AppImprovementInf } from '../interfaces/general.interface';
declare const appImprovementModel: import("mongoose").Model<AppImprovementInf & Document<any, any, any>, {}, {}>;
export default appImprovementModel;
