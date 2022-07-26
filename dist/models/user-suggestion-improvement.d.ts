/// <reference types="mongoose-paginate-v2" />
import { Document } from 'mongoose';
import { UserSuggestionImproveInf } from '../interfaces/general.interface';
declare const userSuggestionImprovementModel: import("mongoose").Model<UserSuggestionImproveInf & Document<any, any, any>, {}, {}>;
export default userSuggestionImprovementModel;
