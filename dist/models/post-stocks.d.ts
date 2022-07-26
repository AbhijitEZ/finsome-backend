/// <reference types="mongoose-paginate-v2" />
import { Document } from 'mongoose';
import { PostStocksInf } from '../interfaces/general.interface';
declare const postStockModel: import("mongoose").Model<PostStocksInf & Document<any, any, any>, {}, {}>;
export default postStockModel;
