import { Document } from 'mongoose';
import { NotificationSubscriptionInf } from '../interfaces/general.interface';
declare const notificationSubscriptionModel: import("mongoose").Model<NotificationSubscriptionInf & Document<any, any, any>, {}, {}>;
export default notificationSubscriptionModel;
