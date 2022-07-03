import { Document } from 'mongoose';
import { OtpValidationInf } from '../interfaces/general.interface';
declare const otpValidationModel: import("mongoose").Model<OtpValidationInf & Document<any, any, any>, {}, {}>;
export default otpValidationModel;
