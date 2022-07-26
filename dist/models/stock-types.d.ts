/// <reference types="mongoose-paginate-v2" />
import { Document } from 'mongoose';
import { StockTypeInf } from '../interfaces/general.interface';
declare const stockTypeModel: import("mongoose").Model<StockTypeInf & Document<any, any, any>, {}, {}>;
export default stockTypeModel;
