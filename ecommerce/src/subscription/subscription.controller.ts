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
    UseGuards,
  } from '@nestjs/common';
  import { SubscriptionService } from './subscription.service';
  import { CreateSubscriptionDto } from './dto/create-subscription.dto';
  import { SubscriptionResponseDto } from './dto/subscription-response.dto';
  
  @Controller('subscriptions')
  export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
      @Body() createSubscriptionDto: CreateSubscriptionDto,
    ): Promise<SubscriptionResponseDto> {
      return await this.subscriptionService.create(createSubscriptionDto);
    }
  
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<SubscriptionResponseDto[]> {
      return await this.subscriptionService.findAll();
    }
  
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id: string): Promise<SubscriptionResponseDto> {
      return await this.subscriptionService.findOne(id);
    }
  
    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(
      @Param('id') id: string,
      @Body() updateSubscriptionDto: Partial<CreateSubscriptionDto>,
    ): Promise<SubscriptionResponseDto> {
      return await this.subscriptionService.update(id, updateSubscriptionDto);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string): Promise<void> {
      return await this.subscriptionService.remove(id);
    }
  }