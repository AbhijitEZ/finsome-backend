import { Document } from 'mongoose';
import { UserRateInf } from '../../interfaces/general.interface';
declare const userRatesModel: import("mongoose").Model<UserRateInf & Document<any, any, any>, {}, {}>;
export default userRatesModel;
