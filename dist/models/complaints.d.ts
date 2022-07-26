/// <reference types="mongoose-paginate-v2" />
import { Document } from 'mongoose';
import { ComplaintsInf } from '../interfaces/general.interface';
declare const complaintModel: import("mongoose").Model<ComplaintsInf & Document<any, any, any>, {}, {}>;
export default complaintModel;
