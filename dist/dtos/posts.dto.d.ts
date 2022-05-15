import { PaginationDto } from './general.dto';
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
    stock_id?: string;
    country_code?: string;
    analysis_type: string;
    trade_type: string;
    is_recommended: string;
    has_all_data?: string;
}
