import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { SubscriptionRepository } from './subscription.repository';
import { Subscription } from './entities/subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionRepository],
  exports: [SubscriptionService, SubscriptionRepository],
})
export class SubscriptionModule {}