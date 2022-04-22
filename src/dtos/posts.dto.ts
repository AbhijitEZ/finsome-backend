import { STOCK_TYPE_CONST } from '@/utils/constants';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from './general.dto';

export class StockTypeDto extends PaginationDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.keys(STOCK_TYPE_CONST))
  type: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  country_code?: string;
}
