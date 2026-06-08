import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsBoolean,
    IsInt,
    MaxLength,
    Min,
  } from 'class-validator';
  
  export class CreateProductImageDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(500)
    url: string;
  
    @IsOptional()
    @IsString()
    @MaxLength(200)
    altText?: string;
  
    @IsOptional()
    @IsInt()
    @Min(0)
    position?: number;
  
    @IsOptional()
    @IsBoolean()
    isPrimary?: boolean;
  }