/// <reference types="mongoose" />
import { PostCreateDto, StockTypeDto, UserConfigurationDto } from '../dtos/posts.dto';
declare class PostService {
    countryObj: import("mongoose").Model<import("../interfaces/general.interface").CountryInf & import("mongoose").Document<any, any, any>, {}, {}>;
    stockTypesObj: import("mongoose").Model<import("../interfaces/general.interface").StockTypeInf & import("mongoose").Document<any, any, any>, {}, {}>;
    userConfigObj: import("mongoose").Model<import("../interfaces/general.interface").UserConfigurationInf & import("mongoose").Document<any, any, any>, {}, {}>;
    countriesGetAll(): Promise<any[]>;
    stockTypesShares(reqData: StockTypeDto): Promise<any>;
    userConfigListing(_id: string): Promise<any>;
    userConfigUpdate(_id: string, reqData: UserConfigurationDto): Promise<any>;
    postCreate(_id: string, reqData: PostCreateDto): Promise<any>;
}
export default PostService;
