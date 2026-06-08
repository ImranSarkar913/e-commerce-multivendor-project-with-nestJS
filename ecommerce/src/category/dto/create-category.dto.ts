import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsBoolean,
    MinLength,
    MaxLength,
  } from 'class-validator';
  
  export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(200)
    name: string;
  
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