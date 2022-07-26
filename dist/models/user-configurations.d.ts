/// <reference types="mongoose-paginate-v2" />
import { Document } from 'mongoose';
import { UserConfigurationInf } from '../interfaces/general.interface';
declare const userConfigurationModel: import("mongoose").Model<UserConfigurationInf & Document<any, any, any>, {}, {}>;
export default userConfigurationModel;
