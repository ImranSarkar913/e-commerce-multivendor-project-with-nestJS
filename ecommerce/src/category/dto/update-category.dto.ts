import {
    IsOptional,
    IsString,
    IsBoolean,
    MinLength,
    MaxLength,
  } from 'class-validator';
  
  export class UpdateCategoryDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(200)
    name?: string;
  
    @IsOptional()
    @IsString()
    @MaxLength(200)
    slug?: string;
  
    @IsOptional()
    @IsString()
    @MaxLength(5000)
    description?: string;
  
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
  }