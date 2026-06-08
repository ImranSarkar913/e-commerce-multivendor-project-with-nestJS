import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSubscriptionController } from './user-subscription.controller';
import { UserSubscriptionService } from './user-subscription.service';
import { UserSubscriptionRepository } from './user-subscription.repository';
import { UserSubscription } from './entities/user-subscription.entity';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSubscription]),
    SubscriptionModule,
  ],
  controllers: [UserSubscriptionController],
  providers: [UserSubscriptionService, UserSubscriptionRepository],
  exports: [UserSubscriptionService],
})
export class UserSubscriptionModule {}