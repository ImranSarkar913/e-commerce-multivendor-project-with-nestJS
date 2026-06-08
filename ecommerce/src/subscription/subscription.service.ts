import {
    Injectable,
    NotFoundException,
    ConflictException,
  } from '@nestjs/common';
  import { CreateSubscriptionDto } from './dto/create-subscription.dto';
  import { SubscriptionResponseDto } from './dto/subscription-response.dto';
  import { SubscriptionRepository } from './subscription.repository';
  
  @Injectable()
  export class SubscriptionService {
    constructor(
      private readonly subscriptionRepository: SubscriptionRepository,
    ) {}
  
    async create(
      createSubscriptionDto: CreateSubscriptionDto,
    ): Promise<SubscriptionResponseDto> {
      // Check if subscription with the same name already exists
      const existingSubscription = await this.subscriptionRepository.findByName(
        createSubscriptionDto.name,
      );
  
      if (existingSubscription) {
        throw new ConflictException(
          `Subscription with name '${createSubscriptionDto.name}' already exists`,
        );
      }
  
      const subscription = await this.subscriptionRepository.create({
        ...createSubscriptionDto
      });
  
      return new SubscriptionResponseDto(subscription);
    }
  
    async findAll(): Promise<SubscriptionResponseDto[]> {
      const subscriptions = await this.subscriptionRepository.findAll();
  
      return subscriptions.map(
        (subscription) => new SubscriptionResponseDto(subscription),
      );
    }
  
    async findOne(id: string): Promise<SubscriptionResponseDto> {
      const subscription = await this.subscriptionRepository.findById(id);
  
      if (!subscription) {
        throw new NotFoundException(`Subscription with ID '${id}' not found`);
      }
  
      return new SubscriptionResponseDto(subscription);
    }
  
    async update(
      id: string,
      updateSubscriptionDto: Partial<CreateSubscriptionDto>,
    ): Promise<SubscriptionResponseDto> {
      const subscription = await this.subscriptionRepository.findById(id);
  
      if (!subscription) {
        throw new NotFoundException(`Subscription with ID '${id}' not found`);
      }
  
      // Check if updating name to an existing name
      if (updateSubscriptionDto.name && updateSubscriptionDto.name !== subscription.name) {
        const existingSubscription = await this.subscriptionRepository.findByName(
          updateSubscriptionDto.name,
        );
  
        if (existingSubscription) {
          throw new ConflictException(
            `Subscription with name '${updateSubscriptionDto.name}' already exists`,
          );
        }
      }
  
      // Convert date strings to Date objects if provided
      const updateData = {
        ...updateSubscriptionDto,
       
      };
  
      Object.assign(subscription, updateData);
      const updatedSubscription = await this.subscriptionRepository.update(subscription);
  
      return new SubscriptionResponseDto(updatedSubscription);
    }
  
    async remove(id: string): Promise<void> {
      const subscription = await this.subscriptionRepository.findById(id);
  
      if (!subscription) {
        throw new NotFoundException(`Subscription with ID '${id}' not found`);
      }
  
      await this.subscriptionRepository.remove(subscription);
    }
  }