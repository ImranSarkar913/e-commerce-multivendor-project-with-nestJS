import {
    IsOptional,
    IsString,
    IsNumber,
    IsBoolean,
    IsArray,
    IsUUID,
    IsInt,
    MinLength,
    MaxLength,
    Min,
  } from 'class-validator';
  
  export class UpdateProductDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(200)
    name?: string;
  
    @IsOptional()
    @IsString()
    @MaxLength(200)
    slug?: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    price?: number;
  
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    compareAtPrice?: number;
  
    @IsOptional()
    @IsString()
    @MaxLength(100)
    sku?: string;
  
    @IsOptional()
    @IsInt()
    @Min(0)
    quantity?: number;
  
    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    categoryIds?: string[];
  
    @IsOptional()
    @IsBoolean()
    isFeatured?: boolean;
  }