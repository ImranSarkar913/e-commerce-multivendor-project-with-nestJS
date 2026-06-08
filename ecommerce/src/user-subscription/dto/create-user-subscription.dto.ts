import {
    IsNotEmpty,
    IsUUID,
    IsBoolean,
    IsOptional,
  } from 'class-validator';
  
  export class CreateUserSubscriptionDto {
    @IsNotEmpty()
    @IsUUID()
    userId: string;
  
    @IsNotEmpty()
    @IsUUID()
    subscriptionId: string;
  
    @IsOptional()
    @IsBoolean()
    autoRenew?: boolean;
  
    @IsOptional()
    @IsUUID()
    paymentId?: string;
  }