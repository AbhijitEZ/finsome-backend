import { ACCOUNT_TYPE_CONST, ANALYSIS_TYPE_CONST, STOCK_RECOMMENDED_CONST, STOCK_TYPE_CONST, TRADE_TYPE_CONST } from '@/utils/constants';
import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from './general.dto';

export class IdPaginationDto extends PaginationDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsBoolean()
  has_all_data: boolean;
}

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

export class PostCreateDto {
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
  security_id: string;

  @IsOptional()
  @IsString({ each: true })
  post_security_ids: string[];

  @IsOptional()
  @IsString()
  @IsIn(Object.keys(STOCK_RECOMMENDED_CONST))
  stock_recommended_type: string;

  @IsNotEmpty()
  @IsString()
  is_recommended: string;

  @IsOptional()
  @IsString()
  buy_recommend_amount: string;

  @IsOptional()
  @IsString()
  sell_recommend_amount: string;

  @IsOptional()
  @IsString()
  caption: string;
}

export class PostHomeDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @IsIn(Object.keys(STOCK_TYPE_CONST))
  type: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString({ each: true })
  stock_ids?: string[];

  @IsOptional()
  @IsString()
  country_code?: string;

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
  is_recommended: string;

  @IsOptional()
  @IsString()
  has_all_data?: string;
}

export class CommentsAddDto {
  @IsNotEmpty()
  @IsString()
  post_id: string;

  @IsOptional()
  @IsString()
  parent_id: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
