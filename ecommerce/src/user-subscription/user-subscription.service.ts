import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
  } from '@nestjs/common';
  import { UserSubscriptionRepository } from './user-subscription.repository';
  import { SubscriptionRepository } from '../subscription/subscription.repository';
  import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
  import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';
  import { UserSubscription, UserSubscriptionStatus } from './entities/user-subscription.entity';
  
  @Injectable()
  export class UserSubscriptionService {
    constructor(
      private readonly userSubscriptionRepository: UserSubscriptionRepository,
      private readonly subscriptionRepository: SubscriptionRepository,
    ) {}
  
    /**
     * Subscribe a user to a plan
     */
    async subscribe(createDto: CreateUserSubscriptionDto): Promise<UserSubscription> {
      // Check if subscription plan exists
      const plan = await this.subscriptionRepository.findById(createDto.subscriptionId);
      if (!plan) {
        throw new NotFoundException(`Subscription plan with ID '${createDto.subscriptionId}' not found`);
      }
  
      // Check if user already has an active subscription
      const existingActive = await this.userSubscriptionRepository.findActiveByUserId(createDto.userId);
      if (existingActive) {
        throw new ConflictException('User already has an active subscription. Please cancel it first.');
      }
  
      // Calculate start and end dates (default: 30 days)
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
  
      const userSubscription = await this.userSubscriptionRepository.create({
        userId: createDto.userId,
        subscriptionId: createDto.subscriptionId,
        startDate,
        endDate,
        status: UserSubscriptionStatus.ACTIVE,
        autoRenew: createDto.autoRenew ?? false,
        paymentId: createDto.paymentId,
      });
  
      return userSubscription;
    }
  
    /**
     * Get all user subscriptions
     */
    async findAll(): Promise<UserSubscription[]> {
      return this.userSubscriptionRepository.findAll();
    }
  
    /**
     * Get a specific user subscription by ID
     */
    async findOne(id: string): Promise<UserSubscription> {
      const userSubscription = await this.userSubscriptionRepository.findById(id);
      if (!userSubscription) {
        throw new NotFoundException(`User subscription with ID '${id}' not found`);
      }
      return userSubscription;
    }
  
    /**
     * Get all subscriptions for a user
     */
    async findByUserId(userId: string): Promise<UserSubscription[]> {
      return this.userSubscriptionRepository.findByUserId(userId);
    }
  
    /**
     * Get user's active subscription
     */
    async findActiveByUserId(userId: string): Promise<UserSubscription | null> {
      return this.userSubscriptionRepository.findActiveByUserId(userId);
    }
  
    /**
     * Check if user has active subscription
     */
    async isSubscriptionActive(userId: string): Promise<boolean> {
      const active = await this.userSubscriptionRepository.findActiveByUserId(userId);
      if (!active) return false;
  
      // Also check if end date hasn't passed
      return new Date() < new Date(active.endDate);
    }
  
    /**
     * Update user subscription
     */
    async update(id: string, updateDto: UpdateUserSubscriptionDto): Promise<UserSubscription> {
      const userSubscription = await this.userSubscriptionRepository.findById(id);
      if (!userSubscription) {
        throw new NotFoundException(`User subscription with ID '${id}' not found`);
      }
  
      if (updateDto.status) {
        userSubscription.status = updateDto.status;
      }
      if (updateDto.autoRenew !== undefined) {
        userSubscription.autoRenew = updateDto.autoRenew;
      }
      if (updateDto.endDate) {
        userSubscription.endDate = new Date(updateDto.endDate);
      }
  
      return this.userSubscriptionRepository.update(userSubscription);
    }
  
    /**
     * Cancel a subscription
     */
    async cancel(id: string): Promise<UserSubscription> {
      const userSubscription = await this.userSubscriptionRepository.findById(id);
      if (!userSubscription) {
        throw new NotFoundException(`User subscription with ID '${id}' not found`);
      }
  
      if (userSubscription.status === UserSubscriptionStatus.CANCELLED) {
        throw new BadRequestException('Subscription is already cancelled');
      }
  
      userSubscription.status = UserSubscriptionStatus.CANCELLED;
      userSubscription.autoRenew = false;
  
      return this.userSubscriptionRepository.update(userSubscription);
    }
  
    /**
     * Renew a subscription (extend end date by 30 days)
     */
    async renew(id: string): Promise<UserSubscription> {
      const userSubscription = await this.userSubscriptionRepository.findById(id);
      if (!userSubscription) {
        throw new NotFoundException(`User subscription with ID '${id}' not found`);
      }
  
      if (userSubscription.status === UserSubscriptionStatus.CANCELLED) {
        throw new BadRequestException('Cannot renew a cancelled subscription. Please create a new subscription.');
      }
  
      // Extend from current end date or from now if expired
      const baseDate = new Date(userSubscription.endDate) > new Date()
        ? new Date(userSubscription.endDate)
        : new Date();
  
      baseDate.setDate(baseDate.getDate() + 30);
      userSubscription.endDate = baseDate;
      userSubscription.status = UserSubscriptionStatus.ACTIVE;
  
      return this.userSubscriptionRepository.update(userSubscription);
    }
  
    /**
     * Mark expired subscriptions (for cron job)
     */
    async markExpiredSubscriptions(): Promise<number> {
      const expired = await this.userSubscriptionRepository.findExpiredSubscriptions();
  
      for (const subscription of expired) {
        subscription.status = UserSubscriptionStatus.EXPIRED;
        await this.userSubscriptionRepository.update(subscription);
      }
  
      return expired.length;
    }
  
    /**
     * Delete a subscription record
     */
    async remove(id: string): Promise<void> {
      const userSubscription = await this.userSubscriptionRepository.findById(id);
      if (!userSubscription) {
        throw new NotFoundException(`User subscription with ID '${id}' not found`);
      }
      await this.userSubscriptionRepository.remove(userSubscription);
    }
  }