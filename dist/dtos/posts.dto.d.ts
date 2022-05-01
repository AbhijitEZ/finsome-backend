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
