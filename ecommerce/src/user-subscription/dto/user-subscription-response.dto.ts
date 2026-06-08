import { UserSubscriptionStatus } from '../entities/user-subscription.entity';

export class UserSubscriptionResponseDto {
  id: string;
  userId: string;
  subscriptionId: string;
  startDate: Date;
  endDate: Date;
  status: UserSubscriptionStatus;
  autoRenew: boolean;
  paymentId: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Nested objects when relations are loaded
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };

  subscription?: {
    id: string;
    name: string;
    price: number;
    currency: string;
    plan: string;
  };
}