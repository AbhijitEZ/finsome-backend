/// <reference types="mongoose" />
import { StockTypeDto } from '../dtos/posts.dto';
declare class PostService {
    countryObj: import("mongoose").Model<import("../interfaces/general.interface").CountryInf & import("mongoose").Document<any, any, any>, {}, {}>;
    stockTypesObj: import("mongoose").Model<import("../interfaces/general.interface").StockTypeInf & import("mongoose").Document<any, any, any>, {}, {}>;
    countriesGetAll(): Promise<any[]>;
    stockTypesShares(reqData: StockTypeDto): Promise<any>;
}
export default PostService;
