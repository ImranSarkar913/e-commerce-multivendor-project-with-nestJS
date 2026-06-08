import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsEnum,
    IsDateString,
    IsBoolean,
    IsOptional,
    Min,
  } from 'class-validator';
  import { SubscriptionPlan, SubscriptionStatus } from '../entities/subscription.entity';
  
  
  export class CreateSubscriptionDto {
    @IsNotEmpty()
    @IsString()
    name: string;
  
    @IsNotEmpty()
    @IsString()
    description: string;
  
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number;
  
    @IsNotEmpty()
    @IsString()
    currency: string;
  
    @IsNotEmpty()
    @IsEnum(SubscriptionPlan)
    plan: SubscriptionPlan;
  
    @IsOptional()
    @IsEnum(SubscriptionStatus)
    status?: SubscriptionStatus;
  
    @IsOptional()
    @IsBoolean()
    autoRenew?: boolean;
  }