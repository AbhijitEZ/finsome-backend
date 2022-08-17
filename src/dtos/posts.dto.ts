import { ACCOUNT_TYPE_CONST, ANALYSIS_TYPE_CONST, STOCK_RECOMMENDED_CONST, STOCK_TYPE_CONST, TRADE_TYPE_CONST } from '@/utils/constants';
import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from './general.dto';

export class IdPaginationDto extends PaginationDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
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

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}

export class StockUpdateTypeDto {
  @IsOptional()
  @IsString()
  id: string;

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

  // This would hold multipe value separated by comma
  @IsOptional()
  @IsString()
  stock_ids?: string;

  @IsOptional()
  @IsString()
  country_code?: string;

  @IsOptional()
  @IsString()
  analysis_type?: string;

  @IsOptional()
  @IsString()
  trade_type?: string;

  @IsOptional()
  @IsString()
  is_recommended: string;

  @IsOptional()
  @IsString()
  is_explore: string;

  @IsOptional()
  @IsString()
  has_all_data?: string;

  /* Specific to user-profile listing */
  @IsOptional()
  @IsString()
  user_id: string;
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

export class LikePostDto {
  @IsNotEmpty()
  @IsBoolean()
  like: boolean;

  @IsNotEmpty()
  @IsString()
  post_id: string;
}

export class ComplaintAddDto {
  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  post_complain_id?: string;

  @IsOptional()
  @IsString()
  user_complain_id?: string;
}

export class PostAssetDeleteDto {
  @IsNotEmpty()
  @IsString()
  names: string;
}

export class StockSearchDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;
}

export class ArticleAddDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
