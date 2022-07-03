import { Document } from 'mongoose';
import { CountryInf } from '../../interfaces/general.interface';
declare const countryModel: import("mongoose").Model<CountryInf & Document<any, any, any>, {}, {}>;
export default countryModel;
