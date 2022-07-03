import { Document } from 'mongoose';
import { PrivacyPolicyInf } from '../../interfaces/general.interface';
declare const privacyPolicyModel: import("mongoose").Model<PrivacyPolicyInf & Document<any, any, any>, {}, {}>;
export default privacyPolicyModel;
