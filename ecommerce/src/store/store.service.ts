import {
    Injectable,
    NotFoundException,
    ConflictException,
  } from '@nestjs/common';
  import { CreateStoreDto } from './dto/create-store.dto';
  import { UpdateStoreDto } from './dto/update-store.dto';
  import { StoreResponseDto } from './dto/store-response.dto';
  import { StoreSearchDto } from './dto/store-search.dto';
  import { StoreRepository } from './store.repository';
  import { StoreStatus } from './entities/store.entity';
  import { UserService } from '../user/user.service';
  
  @Injectable()
  export class StoreService {
    constructor(
      private readonly storeRepository: StoreRepository,
      private readonly userService: UserService,
    ) {}
  
    async create(
      createStoreDto: CreateStoreDto,
    ): Promise<StoreResponseDto> {
      // Validate user exists
      const user = await this.userService.findById(createStoreDto.userId);
      if (!user) {
        throw new NotFoundException('Store owner not found');
      }
  
      // Check if user already has a store (one vendor = one store)
      const existingStore = await this.storeRepository.findByUserId(createStoreDto.userId);
      if (existingStore) {
        throw new ConflictException('You already have a store');
      }
  
      // Generate slug if not provided
      const slug = createStoreDto.slug || this.createSlug(createStoreDto.name);
  
      // Check if slug is unique
      const slugExists = await this.storeRepository.findBySlug(slug);
      if (slugExists) {
        throw new ConflictException(`Store with slug '${slug}' already exists`);
      }
  
      const store = await this.storeRepository.create({
        ...createStoreDto,
        userId: createStoreDto.userId,
        slug,
        status: StoreStatus.PENDING_APPROVAL,
      });
  
      return new StoreResponseDto(store);
    }
  
    async findAll(searchDto?: StoreSearchDto): Promise<StoreResponseDto[]> {
      const stores = searchDto
        ? await this.storeRepository.findAllWithConfig(searchDto)
        : await this.storeRepository.findAllActive();
  
      return stores.map((store) => new StoreResponseDto(store));
    }
  
    async findOne(id: string): Promise<StoreResponseDto> {
      const store = await this.storeRepository.findById(id);
  
      if (!store) {
        throw new NotFoundException(`Store with ID '${id}' not found`);
      }
  
      return new StoreResponseDto(store);
    }
  
    async findBySlug(slug: string): Promise<StoreResponseDto> {
      const store = await this.storeRepository.findBySlug(slug);
  
      if (!store) {
        throw new NotFoundException(`Store with slug '${slug}' not found`);
      }
  
      return new StoreResponseDto(store);
    }
  
    async findByUserId(userId: string): Promise<StoreResponseDto> {
      const store = await this.storeRepository.findByUserId(userId);
  
      if (!store) {
        throw new NotFoundException('Store not found for this user');
      }
  
      return new StoreResponseDto(store);
    }
  
    // Admin + Vendor
    async update(
      id: string,
      updateStoreDto: UpdateStoreDto,
    ): Promise<StoreResponseDto> {
      const store = await this.storeRepository.findById(id);
  
      if (!store) {
        throw new NotFoundException(`Store with ID '${id}' not found`);
      }
  
      Object.assign(store, updateStoreDto);
      const updatedStore = await this.storeRepository.update(store);
  
      return new StoreResponseDto(updatedStore);
    }
  
    // Vendor
    async updateMyStore(
      updateStoreDto: UpdateStoreDto,
    ): Promise<StoreResponseDto> {
      const store = await this.storeRepository.findByUserId(updateStoreDto.userId);
  
      if (!store) {
        throw new NotFoundException('Store not found for this user');
      }
  
      Object.assign(store, updateStoreDto);
      const updatedStore = await this.storeRepository.update(store);
  
      return new StoreResponseDto(updatedStore);
    }
  
    // Admin
    async approve(id: string): Promise<StoreResponseDto> {
      const store = await this.storeRepository.findById(id);
  
      if (!store) {
        throw new NotFoundException(`Store with ID '${id}' not found`);
      }
  
      store.status = StoreStatus.ACTIVE;
      const updatedStore = await this.storeRepository.update(store);
  
      return new StoreResponseDto(updatedStore);
    }
  
    // Admin
    async reject(id: string): Promise<StoreResponseDto> {
      const store = await this.storeRepository.findById(id);
  
      if (!store) {
        throw new NotFoundException(`Store with ID '${id}' not found`);
      }
  
      store.status = StoreStatus.REJECTED;
      const updatedStore = await this.storeRepository.update(store);
  
      return new StoreResponseDto(updatedStore);
    }
  
    async remove(id: string): Promise<void> {
      const store = await this.storeRepository.findById(id);
  
      if (!store) {
        throw new NotFoundException(`Store with ID '${id}' not found`);
      }
  
      await this.storeRepository.remove(store);
    }
  
    private createSlug(name: string): string {
      return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }
  }