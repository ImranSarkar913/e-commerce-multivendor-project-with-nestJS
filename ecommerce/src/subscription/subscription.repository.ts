import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionRepository {
  constructor(
    @InjectRepository(Subscription)
    private readonly repository: Repository<Subscription>,
  ) {}

  async create(subscription: Partial<Subscription>): Promise<Subscription> {
    const newSubscription = this.repository.create(subscription);
    return await this.repository.save(newSubscription);
  }

  async findAll(): Promise<Subscription[]> {
    return await this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Subscription | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Subscription | null> {
    return await this.repository.findOne({
      where: { name },
    });
  }

  async update(subscription: Subscription): Promise<Subscription> {
    return await this.repository.save(subscription);
  }

  async remove(subscription: Subscription): Promise<void> {
    await this.repository.remove(subscription);
  }
}