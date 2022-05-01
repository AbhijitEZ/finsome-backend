import { ACCOUNT_TYPE_CONST, ANALYSIS_TYPE_CONST, STOCK_TYPE_CONST, TRADE_TYPE_CONST } from '@/utils/constants';
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

  @IsOptional()
  @IsString()
  has_all_data?: string;
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

export class UserConfigurationDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.keys(STOCK_TYPE_CONST))
  stock_type: string;

  @IsOptional()
  @IsString()
  @IsIn(Object.keys(ANALYSIS_TYPE_CONST))
  analysis_type: string;

  @IsOptional()
  @IsString()
  @IsIn(Object.keys(TRADE_TYPE_CONST))
  trade_type: string;

  @IsOptional()
  @IsString()
  @IsIn(Object.keys(ACCOUNT_TYPE_CONST))
  account_type: string;
}
