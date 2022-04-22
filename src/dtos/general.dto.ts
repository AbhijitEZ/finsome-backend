import { IsOptional, IsString } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsString()
  skip?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
