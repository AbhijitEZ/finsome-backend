import { STOCK_TYPE_CONST } from '@/utils/constants';
import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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

  @IsOptional()
  @IsBoolean()
  has_all_data?: boolean;
}

export class StockUpdateTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  // This would be replaced with actual multer later down point
  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  country_code?: string;
}
