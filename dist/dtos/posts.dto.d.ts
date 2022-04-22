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
