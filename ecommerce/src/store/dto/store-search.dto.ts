
  // DTO for search configs
  import { IsOptional, IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { StoreStatus } from '../entities/store.entity';

  export class StoreSearchDto {
    @IsOptional()
    @IsEnum(StoreStatus)
    status?: StoreStatus;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    slug?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    contactEmail?: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    contactPhone?: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    search?: string;
  }