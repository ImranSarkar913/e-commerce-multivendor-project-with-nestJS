import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSubscription, UserSubscriptionStatus } from './entities/user-subscription.entity';

@Injectable()
export class UserSubscriptionRepository {
  constructor(
    @InjectRepository(UserSubscription)
    private readonly repository: Repository<UserSubscription>,
  ) {}

  async create(userSubscription: Partial<UserSubscription>): Promise<UserSubscription> {
    const newUserSubscription = this.repository.create(userSubscription);
    return await this.repository.save(newUserSubscription);
  }

  async findAll(): Promise<UserSubscription[]> {
    return await this.repository.find({
      relations: ['user', 'subscription'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<UserSubscription | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['user', 'subscription'],
    });
  }

  async findByUserId(userId: string): Promise<UserSubscription[]> {
    return await this.repository.find({
      where: { userId },
      relations: ['subscription'],
      order: { createdAt: 'DESC' },
    });
  }

  async findActiveByUserId(userId: string): Promise<UserSubscription | null> {
    return await this.repository.findOne({
      where: {
        userId,
        status: UserSubscriptionStatus.ACTIVE,
      },
      relations: ['subscription'],
    });
  }

  async findBySubscriptionId(subscriptionId: string): Promise<UserSubscription[]> {
    return await this.repository.find({
      where: { subscriptionId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(userSubscription: UserSubscription): Promise<UserSubscription> {
    return await this.repository.save(userSubscription);
  }

  async remove(userSubscription: UserSubscription): Promise<void> {
    await this.repository.remove(userSubscription);
  }

  async findExpiredSubscriptions(): Promise<UserSubscription[]> {
    return await this.repository
      .createQueryBuilder('userSubscription')
      .where('userSubscription.status = :status', { status: UserSubscriptionStatus.ACTIVE })
      .andWhere('userSubscription.endDate < :now', { now: new Date() })
      .getMany();
  }
}