import {
    IsEnum,
    IsBoolean,
    IsOptional,
    IsDateString,
  } from 'class-validator';
  import { UserSubscriptionStatus } from '../entities/user-subscription.entity';
  
  export class UpdateUserSubscriptionDto {
    @IsOptional()
    @IsEnum(UserSubscriptionStatus)
    status?: UserSubscriptionStatus;
  
    @IsOptional()
    @IsBoolean()
    autoRenew?: boolean;
  
    @IsOptional()
    @IsDateString()
    endDate?: string;
  }