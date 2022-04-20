/// <reference types="mongoose" />
declare class PostService {
    countryObj: import("mongoose").Model<import("../interfaces/general.interface").CountryInf & import("mongoose").Document<any, any, any>, {}, {}>;
    countriesGetAll(): Promise<any[]>;
}
export default PostService;
