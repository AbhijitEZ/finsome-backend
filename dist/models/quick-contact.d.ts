import { Document } from 'mongoose';
import { QuickContactInf } from '../interfaces/general.interface';
declare const quickContactModel: import("mongoose").Model<QuickContactInf & Document<any, any, any>, {}, {}>;
export default quickContactModel;
