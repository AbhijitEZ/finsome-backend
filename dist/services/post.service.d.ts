/// <reference types="multer" />
/// <reference types="mongoose" />
import { CommentsAddDto, ComplaintAddDto, IdPaginationDto, LikePostDto, PostAssetDeleteDto, PostCreateDto, PostHomeDto, StockTypeDto, UserConfigurationDto } from '../dtos/posts.dto';
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
        comments: number;
        total_comments: number;
        deleted_at: number;
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
    postCreate(_id: string, reqData: PostCreateDto, files?: Record<string, Array<Express.Multer.File>>, postId?: String): Promise<any>;
    postDetail(userId: string, postId: string): Promise<any>;
    postDelete(userId: string, postId: string): Promise<any>;
    postDeleteAssets(userId: string, postId: string, reqData: PostAssetDeleteDto): Promise<any>;
    commentListing(userId: string, reqData: IdPaginationDto): Promise<any>;
    commentAdd(userId: string, reqData: CommentsAddDto): Promise<any>;
    commentDelete(userId: string, postId: string, commentId: string): Promise<any>;
    postLikeUpdate(userId: string, reqData: LikePostDto): Promise<any>;
    complaintAdd(userId: string, reqData: ComplaintAddDto): Promise<any>;
    protected singlePostAggreData(postId: string, userId: string): Promise<any>;
}
export default PostService;
