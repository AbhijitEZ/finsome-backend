/// <reference types="mongoose-paginate-v2" />
import { Document } from 'mongoose';
import { DeviceTokenInf } from '../interfaces/users.interface';
declare const deviceTokenModel: import("mongoose").Model<DeviceTokenInf & Document<any, any, any>, {}, {}>;
export default deviceTokenModel;
