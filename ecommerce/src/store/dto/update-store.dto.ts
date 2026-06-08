import {
    IsString,
    IsEmail,
    IsOptional,
    IsEnum,
    MinLength,
    MaxLength,
    IsNotEmpty,
  } from 'class-validator';
  import { StoreStatus } from '../entities/store.entity';
  
  export class UpdateStoreDto {
    @IsNotEmpty()
    @IsString()
    userId: string;
  
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    name?: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsOptional()
    @IsString()
    @MaxLength(500)
    logo?: string;
  
    @IsOptional()
    @IsEnum(StoreStatus)
    status?: StoreStatus;
  
    @IsOptional()
    @IsEmail()
    @MaxLength(255)
    contactEmail?: string;
  
    @IsOptional()
    @IsString()
    @MaxLength(20)
    contactPhone?: string;
  }