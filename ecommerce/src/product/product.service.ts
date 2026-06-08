import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
  } from '@nestjs/common';
  import { ProductRepository } from './product.repository';
  import { StoreService } from '../store/store.service';
  import { CategoryRepository } from '../category/category.repository';
  import { CreateProductDto } from './dto/create-product.dto';
  import { UpdateProductDto } from './dto/update-product.dto';
  import { CreateProductImageDto } from './dto/product-image.dto';
  import { ProductSearchDto } from './dto/product-search.dto';
  import { ProductResponseDto } from './dto/product-response.dto';
  import { ProductStatus } from './entities/product.entity';
  import { Category } from '../category/entities/category.entity';
  
  @Injectable()
  export class ProductService {
    constructor(
      private readonly productRepository: ProductRepository,
      private readonly storeService: StoreService,
      private readonly categoryRepository: CategoryRepository,
    ) {}
  
    // ─── Product CRUD ───
  
    async create(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
      // Find user's store
      const store = await this.storeService.findByUserId(createProductDto.userId);
  
      // Generate slug
      const slug = createProductDto.slug || this.createSlug(createProductDto.name);
  
      // Check slug uniqueness within store
      const existing = await this.productRepository.findByStoreIdAndSlug(store.id, slug);
      if (existing) {
        throw new ConflictException(`Product with slug '${slug}' already exists in this store`);
      }
  
      // Resolve categories
      let categories: Category[] = [];
      if (createProductDto.categoryIds?.length) {
        categories = await this.resolveCategories(createProductDto.categoryIds);
      }
  
      const product = await this.productRepository.createProduct({
        storeId: store.id,
        name: createProductDto.name,
        slug,
        description: createProductDto.description,
        price: createProductDto.price,
        compareAtPrice: createProductDto.compareAtPrice,
        sku: createProductDto.sku,
        quantity: createProductDto.quantity ?? 0,
        status: ProductStatus.DRAFT,
        categories,
      });
  
      // Re-fetch with relations
      const created = await this.productRepository.findById(product.id);
      if (!created) {
        throw new NotFoundException(`Product with ID '${product.id}' not found`);
      }
      return new ProductResponseDto(created);
    }
  
    async findByStoreUserId(userId: string): Promise<ProductResponseDto[]> {
      const store = await this.storeService.findByUserId(userId);
      const products = await this.productRepository.findByStoreId(store.id);
      return products.map((p) => new ProductResponseDto(p));
    }
  
    async findOne(id: string): Promise<ProductResponseDto> {
      const product = await this.productRepository.findById(id);
      if (!product) {
        throw new NotFoundException(`Product with ID '${id}' not found`);
      }
      return new ProductResponseDto(product);
    }
  
    async update(id: string, userId: string, updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
      const product = await this.productRepository.findById(id);
      if (!product) {
        throw new NotFoundException(`Product with ID '${id}' not found`);
      }
  
      // Verify ownership
      const store = await this.storeService.findByUserId(userId);
      if (product.storeId !== store.id) {
        throw new NotFoundException(`Product with ID '${id}' not found`);
      }
  
      // If slug changed, check uniqueness
      if (updateProductDto.slug && updateProductDto.slug !== product.slug) {
        const existing = await this.productRepository.findByStoreIdAndSlug(product.storeId, updateProductDto.slug);
        if (existing) {
          throw new ConflictException(`Product with slug '${updateProductDto.slug}' already exists in this store`);
        }
      }
  
      // Update categories if provided
      if (updateProductDto.categoryIds) {
        product.categories = await this.resolveCategories(updateProductDto.categoryIds);
      }
  
      // Apply other updates
      const { categoryIds, ...updates } = updateProductDto;
      Object.assign(product, updates);
  
      const updated = await this.productRepository.updateProduct(product);
      const result = await this.productRepository.findById(updated.id);
      if (!result) {
        throw new NotFoundException(`Product with ID '${updated.id}' not found`);
      }
      return new ProductResponseDto(result);
    }
  
    async remove(id: string, userId: string): Promise<void> {
      const product = await this.productRepository.findById(id);
      if (!product) {
        throw new NotFoundException(`Product with ID '${id}' not found`);
      }
  
      const store = await this.storeService.findByUserId(userId);
      if (product.storeId !== store.id) {
        throw new NotFoundException(`Product with ID '${id}' not found`);
      }
  
      await this.productRepository.softDelete(id);
    }
  
    // ─── Publish / Unpublish ───
  
    async publish(id: string, userId: string): Promise<ProductResponseDto> {
      const product = await this.productRepository.findById(id);
      if (!product) {
        throw new NotFoundException(`Product with ID '${id}' not found`);
      }
  
      const store = await this.storeService.findByUserId(userId);
      if (product.storeId !== store.id) {
        throw new NotFoundException(`Product with ID '${id}' not found`);
      }
  
      // Validate: must have name, price, at least 1 image
      if (!product.name || product.price === null || product.price === undefined) {
        throw new BadRequestException('Product must have a name and price to be published');
      }
  
      if (!product.images || product.images.length === 0) {
        throw new BadRequestException('Product must have at least one image to be published');
      }
  
      product.status = ProductStatus.PUBLISHED;
      product.publishedAt = new Date();
  
      const updated = await this.productRepository.updateProduct(product);
      return new ProductResponseDto(updated);
    }
  
    async unpublish(id: string, userId: string): Promise<ProductResponseDto> {
      const product = await this.productRepository.findById(id);
      if (!product) {
        throw new NotFoundException(`Product with ID '${id}' not found`);
      }
  
      const store = await this.storeService.findByUserId(userId);
      if (product.storeId !== store.id) {
        throw new NotFoundException(`Product with ID '${id}' not found`);
      }
  
      product.status = ProductStatus.DRAFT;
      product.publishedAt = null;
  
      const updated = await this.productRepository.updateProduct(product);
      return new ProductResponseDto(updated);
    }
  
    // ─── Images ───
  
    async addImage(productId: string, userId: string, imageDto: CreateProductImageDto): Promise<ProductResponseDto> {
      const product = await this.productRepository.findById(productId);
      if (!product) {
        throw new NotFoundException(`Product with ID '${productId}' not found`);
      }
  
      const store = await this.storeService.findByUserId(userId);
      if (product.storeId !== store.id) {
        throw new NotFoundException(`Product with ID '${productId}' not found`);
      }
  
      // Max 5 images
      const imageCount = await this.productRepository.countImagesByProductId(productId);
      if (imageCount >= 5) {
        throw new BadRequestException('Maximum 5 images per product');
      }
  
      await this.productRepository.createImage({
        productId,
        url: imageDto.url,
        altText: imageDto.altText,
        position: imageDto.position ?? imageCount,
        isPrimary: imageDto.isPrimary ?? imageCount === 0,
      });
  
      const updated = await this.productRepository.findById(productId);
      if (!updated) {
        throw new NotFoundException(`Product with ID '${productId}' not found`);
      }
      return new ProductResponseDto(updated);
    }
  
    async removeImage(productId: string, imageId: string, userId: string): Promise<ProductResponseDto> {
      const product = await this.productRepository.findById(productId);
      if (!product) {
        throw new NotFoundException(`Product with ID '${productId}' not found`);
      }
  
      const store = await this.storeService.findByUserId(userId);
      if (product.storeId !== store.id) {
        throw new NotFoundException(`Product with ID '${productId}' not found`);
      }
  
      const image = await this.productRepository.findImageById(imageId);
      if (!image || image.productId !== productId) {
        throw new NotFoundException(`Image with ID '${imageId}' not found`);
      }
  
      await this.productRepository.removeImage(image);
  
      const updated = await this.productRepository.findById(productId);
      if (!updated) {
        throw new NotFoundException(`Product with ID '${productId}' not found`);
      }
      return new ProductResponseDto(updated);
    }
  
    // ─── Public Endpoints ───
  
    async findPublished(searchDto: ProductSearchDto): Promise<{ data: ProductResponseDto[]; total: number; page: number; limit: number }> {
      const { data, total } = await this.productRepository.searchPublished(searchDto);
      return {
        data: data.map((p) => new ProductResponseDto(p)),
        total,
        page: searchDto.page || 1,
        limit: searchDto.limit || 20,
      };
    }
  
    async findPublishedByStoreSlug(storeSlug: string): Promise<ProductResponseDto[]> {
      const products = await this.productRepository.findPublishedByStoreSlug(storeSlug);
      return products.map((p) => new ProductResponseDto(p));
    }
  
    async findPublishedByCategorySlug(
      categorySlug: string,
      page: number = 1,
      limit: number = 20,
    ): Promise<{ data: ProductResponseDto[]; total: number }> {
      const category = await this.categoryRepository.findBySlug(categorySlug);
      if (!category) {
        throw new NotFoundException(`Category with slug '${categorySlug}' not found`);
      }
  
      const { data, total } = await this.productRepository.findPublishedByCategoryId(category.id, page, limit);
      return {
        data: data.map((p) => new ProductResponseDto(p)),
        total,
      };
    }
  
    // ─── Admin ───
  
    async findAllAdmin(searchDto?: ProductSearchDto): Promise<{ data: ProductResponseDto[]; total: number }> {
      const { data, total } = await this.productRepository.findAllAdmin(searchDto);
      return {
        data: data.map((p) => new ProductResponseDto(p)),
        total,
      };
    }
  
    async hideProduct(id: string): Promise<ProductResponseDto> {
      const product = await this.productRepository.findById(id);
      if (!product) {
        throw new NotFoundException(`Product with ID '${id}' not found`);
      }
  
      product.status = ProductStatus.HIDDEN;
      const updated = await this.productRepository.updateProduct(product);
      return new ProductResponseDto(updated);
    }
  
    async unhideProduct(id: string): Promise<ProductResponseDto> {
      const product = await this.productRepository.findById(id);
      if (!product) {
        throw new NotFoundException(`Product with ID '${id}' not found`);
      }
  
      if (product.status !== ProductStatus.HIDDEN) {
        throw new BadRequestException('Product is not hidden');
      }
  
      product.status = ProductStatus.DRAFT;
      const updated = await this.productRepository.updateProduct(product);
      return new ProductResponseDto(updated);
    }
  
    // ─── Helpers ───
  
    private createSlug(name: string): string {
      return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }
  
    private async resolveCategories(categoryIds: string[]): Promise<Category[]> {
      const categories: Category[] = [];
      for (const id of categoryIds) {
        const category = await this.categoryRepository.findById(id);
        if (category) {
          categories.push(category);
        }
      }
      return categories;
    }
  }