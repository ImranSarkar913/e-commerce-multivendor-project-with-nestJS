import {
    IsOptional,
    IsString,
    IsNumber,
    IsEnum,
    IsInt,
    IsUUID,
    Min,
    Max,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export enum ProductSortBy {
    PRICE_ASC = 'price_asc',
    PRICE_DESC = 'price_desc',
    CREATED_AT = 'created_at',
    NAME = 'name',
  }
  
  export class ProductSearchDto {
    @IsOptional()
    @IsString()
    q?: string;
  
    @IsOptional()
    @IsUUID()
    categoryId?: string;
  
    @IsOptional()
    @IsUUID()
    storeId?: string;
  
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    minPrice?: number;
  
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    maxPrice?: number;
  
    @IsOptional()
    @IsEnum(ProductSortBy)
    sortBy?: ProductSortBy;
  
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;
  
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    limit?: number = 20;
  }