import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    HttpCode,
    HttpStatus,
    Req,
  } from '@nestjs/common';
  import { StoreService } from './store.service';
  import { CreateStoreDto } from './dto/create-store.dto';
  import { UpdateStoreDto } from './dto/update-store.dto';
  import { StoreSearchDto } from './dto/store-search.dto';
  import { StoreResponseDto } from './dto/store-response.dto';
  
  @Controller('stores')
  export class StoreController {
    constructor(private readonly storeService: StoreService) {}
  
    // Vendor: Create a new store
    // TODO: Add auth guard and get userId from token
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
      @Body() createStoreDto: CreateStoreDto,
      // @CurrentUser() userId: string, // Will come from auth decorator
    ): Promise<StoreResponseDto> {
      // Generate a random userId for now (will be replaced by actual user from auth in the future)
     
      return await this.storeService.create(createStoreDto);
    }
  
    // Public: List all active stores
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@Query() searchDto: StoreSearchDto): Promise<StoreResponseDto[]> {
      return await this.storeService.findAll(searchDto);
    }
  
    // Vendor: Get my own store
    // TODO: Add auth guard
    @Get('my-store')
    @HttpCode(HttpStatus.OK)
    async findMyStore(@Req() req): Promise<StoreResponseDto> {
      const userId = req?.user?.id;
      return await this.storeService.findByUserId(userId);
    }
  
    // Vendor: Update my store
    // TODO: Add auth guard
    @Patch('my-store')
    @HttpCode(HttpStatus.OK)
    async updateMyStore(
      @Body() updateStoreDto: UpdateStoreDto,
    ): Promise<StoreResponseDto> {
      
      return await this.storeService.updateMyStore(updateStoreDto);
    }
  
    // Public: Get store by slug
    @Get(':slug')
    @HttpCode(HttpStatus.OK)
    async findBySlug(@Param('slug') slug: string): Promise<StoreResponseDto> {
      return await this.storeService.findBySlug(slug);
    }
  }
  
  // Admin controller for store management
  @Controller('admin/stores')
  export class AdminStoreController {
    constructor(private readonly storeService: StoreService) {}
  
    // Admin: List all stores (with filters)
    // TODO: Add admin guard
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@Query() searchDto: StoreSearchDto): Promise<StoreResponseDto[]> {
      return await this.storeService.findAll(searchDto);
    }
  
    // Admin: Get store by ID
    // TODO: Add admin guard
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id: string): Promise<StoreResponseDto> {
      return await this.storeService.findOne(id);
    }
  
    // Admin: Update store
    // TODO: Add admin guard
    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(
      @Param('id') id: string,
      @Body() updateStoreDto: UpdateStoreDto,
    ): Promise<StoreResponseDto> {
      return await this.storeService.update(id, updateStoreDto);
    }
  
    // Admin: Approve store
    // TODO: Add admin guard
    @Patch(':id/approve')
    @HttpCode(HttpStatus.OK)
    async approve(@Param('id') id: string): Promise<StoreResponseDto> {
      return await this.storeService.approve(id);
    }
  
    // Admin: Reject store
    // TODO: Add admin guard
    @Patch(':id/reject')
    @HttpCode(HttpStatus.OK)
    async reject(@Param('id') id: string): Promise<StoreResponseDto> {
      return await this.storeService.reject(id);
    }
  
    // Admin: Delete store
    // TODO: Add admin guard
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string): Promise<void> {
      return await this.storeService.remove(id);
    }
  }