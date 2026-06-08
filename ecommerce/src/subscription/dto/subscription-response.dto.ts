import { SubscriptionPlan, SubscriptionStatus } from '../entities/subscription.entity';

export class SubscriptionResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<SubscriptionResponseDto>) {
    Object.assign(this, partial);
  }
}