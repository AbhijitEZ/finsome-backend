/// <reference types="multer" />
/// <reference types="mongoose" />
import { CommentsAddDto, IdPaginationDto, LikePostDto, PostCreateDto, PostHomeDto, StockTypeDto, UserConfigurationDto } from '../dtos/posts.dto';
declare class PostService {
    countryObj: import("mongoose").Model<import("../interfaces/general.interface").CountryInf & import("mongoose").Document<any, any, any>, {}, {}>;
    stockTypesObj: import("mongoose").Model<import("../interfaces/general.interface").StockTypeInf & import("mongoose").Document<any, any, any>, {}, {}>;
    userConfigObj: import("mongoose").Model<import("../interfaces/general.interface").UserConfigurationInf & import("mongoose").Document<any, any, any>, {}, {}>;
    postsObj: import("mongoose").Model<import("../interfaces/general.interface").PostsInf & import("mongoose").Document<any, any, any>, {}, {}>;
    postResObj: {
        _id: number;
        is_recommended: number;
        post_images: number;
        post_thumbs: number;
        post_vids: number;
        user_id: number;
        stock_type: number;
        post_stock: number;
        analysis_type: number;
        trade_type: number;
        security_id: number;
        stock_recommended_type: number;
        buy_recommend_amount: number;
        sell_recommend_amount: number;
        caption: number;
        created_at: number;
        updated_at: number;
        created_at_tz: {
            $dateToString: {
                date: string;
                timezone: string;
                format: string;
            };
        };
        user: number;
        security: number;
        likes: number;
        total_likes: number;
    };
    commentResObj: {
        _id: number;
        parent_id: number;
        message: number;
        created_at: number;
        updated_at: number;
        user_id: number;
        post_id: number;
        created_at_tz: {
            $dateToString: {
                date: string;
                timezone: string;
                format: string;
            };
        };
        user: number;
        post: number;
        reply: number;
    };
    countriesGetAll(): Promise<any[]>;
    stockTypesShares(reqData: StockTypeDto): Promise<any>;
    userConfigListing(_id: string): Promise<any>;
    userConfigUpdate(_id: string, reqData: UserConfigurationDto): Promise<any>;
    postExplore(_id: string): Promise<any>;
    postHome(_id: string, queryData: PostHomeDto): Promise<any>;
    postCreate(_id: string, reqData: PostCreateDto, files?: Record<string, Array<Express.Multer.File>>): Promise<any>;
    commentListing(userId: string, reqData: IdPaginationDto): Promise<any>;
    commentAdd(userId: string, reqData: CommentsAddDto): Promise<any>;
    postLikeUpdate(userId: string, reqData: LikePostDto): Promise<any>;
}
export default PostService;
