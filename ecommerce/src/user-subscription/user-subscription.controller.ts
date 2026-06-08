import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
  import { UserSubscriptionService } from './user-subscription.service';
  import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
  import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';
  import { UserSubscription } from './entities/user-subscription.entity';
  
  @Controller('user-subscriptions')
  export class UserSubscriptionController {
    constructor(private readonly userSubscriptionService: UserSubscriptionService) {}
  
    /**
     * POST /user-subscriptions
     * Subscribe a user to a plan
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async subscribe(
      @Body() createDto: CreateUserSubscriptionDto,
    ): Promise<UserSubscription> {
      return await this.userSubscriptionService.subscribe(createDto);
    }
  
    /**
     * GET /user-subscriptions
     * Get all user subscriptions
     */
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<UserSubscription[]> {
      return await this.userSubscriptionService.findAll();
    }
  
    /**
     * GET /user-subscriptions/user/:userId
     * Get all subscriptions for a user
     */
    @Get('user/:userId')
    @HttpCode(HttpStatus.OK)
    async findByUserId(@Param('userId') userId: string): Promise<UserSubscription[]> {
      return await this.userSubscriptionService.findByUserId(userId);
    }
  
    /**
     * GET /user-subscriptions/user/:userId/active
     * Get user's active subscription
     */
    @Get('user/:userId/active')
    @HttpCode(HttpStatus.OK)
    async findActiveByUserId(@Param('userId') userId: string): Promise<UserSubscription | null> {
      return await this.userSubscriptionService.findActiveByUserId(userId);
    }
  
    /**
     * GET /user-subscriptions/user/:userId/status
     * Check if user has active subscription
     */
    @Get('user/:userId/status')
    @HttpCode(HttpStatus.OK)
    async checkStatus(@Param('userId') userId: string): Promise<{ isActive: boolean }> {
      const isActive = await this.userSubscriptionService.isSubscriptionActive(userId);
      return { isActive };
    }

  /**
   * GET /user-subscriptions/:id
   * Get a specific subscription by ID
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<UserSubscription> {
    return await this.userSubscriptionService.findOne(id);
  }
  
    /**
     * PATCH /user-subscriptions/:id
     * Update a subscription
     */
    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(
      @Param('id') id: string,
      @Body() updateDto: UpdateUserSubscriptionDto,
    ): Promise<UserSubscription> {
      return await this.userSubscriptionService.update(id, updateDto);
    }
  
    /**
     * PATCH /user-subscriptions/:id/cancel
     * Cancel a subscription
     */
    @Patch(':id/cancel')
    @HttpCode(HttpStatus.OK)
    async cancel(@Param('id') id: string): Promise<UserSubscription> {
      return await this.userSubscriptionService.cancel(id);
    }
  
    /**
     * PATCH /user-subscriptions/:id/renew
     * Renew a subscription (extend by 30 days)
     */
    @Patch(':id/renew')
    @HttpCode(HttpStatus.OK)
    async renew(@Param('id') id: string): Promise<UserSubscription> {
      return await this.userSubscriptionService.renew(id);
    }
  
    /**
     * DELETE /user-subscriptions/:id
     * Delete a subscription record
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string): Promise<void> {
      return await this.userSubscriptionService.remove(id);
    }
  }