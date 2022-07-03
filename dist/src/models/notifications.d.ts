import { Document } from 'mongoose';
import { NotificationInf } from '../../interfaces/general.interface';
declare const notificationModel: import("mongoose").Model<NotificationInf & Document<any, any, any>, {}, {}>;
export default notificationModel;
