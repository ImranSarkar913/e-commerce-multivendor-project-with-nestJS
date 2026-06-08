import {
    IsNotEmpty,
    IsString,
    IsEmail,
    IsOptional,
    MinLength,
    MaxLength,
  } from 'class-validator';
  
  export class CreateStoreDto {
    @IsNotEmpty()
    @IsString()
    userId: string;
  
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    name: string;
  
    @IsOptional()
    @IsString()
    @MaxLength(100)
    slug?: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(255)
    contactEmail: string;
  
    @IsOptional()
    @IsString()
    @MaxLength(20)
    contactPhone?: string;
  }