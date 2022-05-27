import { PaginationDto } from './general.dto';
export declare class IdPaginationDto extends PaginationDto {
    id: string;
    has_all_data: boolean;
}
export declare class StockTypeDto extends PaginationDto {
    type: string;
    search?: string;
    country_code?: string;
    has_all_data?: string;
}
export declare class StockUpdateTypeDto {
    name: string;
    code: string;
    image?: string;
    country_code?: string;
}
export declare class UserConfigurationDto {
    stock_type: string;
    analysis_type: string;
    trade_type: string;
    account_type: string;
}
export declare class PostCreateDto {
    stock_type: string;
    analysis_type: string;
    trade_type: string;
    security_id: string;
    post_security_ids: string[];
    stock_recommended_type: string;
    is_recommended: string;
    buy_recommend_amount: string;
    sell_recommend_amount: string;
    caption: string;
}
export declare class PostHomeDto extends PaginationDto {
    type: string;
    search?: string;
    date?: string;
    stock_ids?: string;
    country_code?: string;
    analysis_type: string;
    trade_type: string;
    is_recommended: string;
    has_all_data?: string;
}
export declare class CommentsAddDto {
    post_id: string;
    parent_id: string;
    message: string;
}
export declare class LikePostDto {
    like: boolean;
    post_id: string;
}
export declare class ComplaintAddDto {
    reason: string;
    description: string;
    post_complain_id?: string;
    user_complain_id?: string;
}
