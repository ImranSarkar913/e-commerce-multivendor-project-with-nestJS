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
  } from '@nestjs/common';
  import { ProductService } from './product.service';
  import { CreateProductDto } from './dto/create-product.dto';
  import { UpdateProductDto } from './dto/update-product.dto';
  import { CreateProductImageDto } from './dto/product-image.dto';
  import { ProductSearchDto } from './dto/product-search.dto';
  import { ProductResponseDto } from './dto/product-response.dto';
  
  // ─── Store Owner Endpoints ───
  @Controller('stores/my-store/products')
  export class StoreProductController {
    constructor(private readonly productService: ProductService) {}
  
    // TODO: Add auth guard and get userId from token
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createProductDto: CreateProductDto): Promise<ProductResponseDto> {
      return await this.productService.create(createProductDto);
    }
  
    // TODO: Add auth guard
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@Body('userId') userId: string): Promise<ProductResponseDto[]> {
      return await this.productService.findByStoreUserId(userId);
    }
  
    // TODO: Add auth guard
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
      return await this.productService.findOne(id);
    }
  
    // TODO: Add auth guard
    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(
      @Param('id') id: string,
      @Body() updateProductDto: UpdateProductDto & { userId: string },
    ): Promise<ProductResponseDto> {
      const { userId, ...dto } = updateProductDto;
      return await this.productService.update(id, userId, dto);
    }
  
    // TODO: Add auth guard
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(
      @Param('id') id: string,
      @Body('userId') userId: string,
    ): Promise<void> {
      return await this.productService.remove(id, userId);
    }
  
    // Publish
    // TODO: Add auth guard
    @Patch(':id/publish')
    @HttpCode(HttpStatus.OK)
    async publish(
      @Param('id') id: string,
      @Body('userId') userId: string,
    ): Promise<ProductResponseDto> {
      return await this.productService.publish(id, userId);
    }
  
    // Unpublish
    // TODO: Add auth guard
    @Patch(':id/unpublish')
    @HttpCode(HttpStatus.OK)
    async unpublish(
      @Param('id') id: string,
      @Body('userId') userId: string,
    ): Promise<ProductResponseDto> {
      return await this.productService.unpublish(id, userId);
    }
  
    // ─── Images ───
  
    // TODO: Add auth guard
    @Post(':id/images')
    @HttpCode(HttpStatus.CREATED)
    async addImage(
      @Param('id') id: string,
      @Body() body: CreateProductImageDto & { userId: string },
    ): Promise<ProductResponseDto> {
      const { userId, ...imageDto } = body;
      return await this.productService.addImage(id, userId, imageDto);
    }
  
    // TODO: Add auth guard
    @Delete(':id/images/:imageId')
    @HttpCode(HttpStatus.OK)
    async removeImage(
      @Param('id') id: string,
      @Param('imageId') imageId: string,
      @Body('userId') userId: string,
    ): Promise<ProductResponseDto> {
      return await this.productService.removeImage(id, imageId, userId);
    }
  }
  
  // ─── Public Endpoints ───
  @Controller('products')
  export class PublicProductController {
    constructor(private readonly productService: ProductService) {}
  
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@Query() searchDto: ProductSearchDto) {
      return await this.productService.findPublished(searchDto);
    }
  
    @Get('search')
    @HttpCode(HttpStatus.OK)
    async search(@Query() searchDto: ProductSearchDto) {
      return await this.productService.findPublished(searchDto);
    }
  }
  
  // Public: Store products by store slug
  @Controller('stores')
  export class StorePublicProductController {
    constructor(private readonly productService: ProductService) {}
  
    @Get(':storeSlug/products')
    @HttpCode(HttpStatus.OK)
    async findByStoreSlug(
      @Param('storeSlug') storeSlug: string,
    ): Promise<ProductResponseDto[]> {
      return await this.productService.findPublishedByStoreSlug(storeSlug);
    }
  }
  
  // Public: Products by category slug
  @Controller('categories')
  export class CategoryProductController {
    constructor(private readonly productService: ProductService) {}
  
    @Get(':slug/products')
    @HttpCode(HttpStatus.OK)
    async findByCategorySlug(
      @Param('slug') slug: string,
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 20,
    ) {
      return await this.productService.findPublishedByCategorySlug(slug, page, limit);
    }
  }
  
  // ─── Admin Endpoints ───
  @Controller('admin/products')
  export class AdminProductController {
    constructor(private readonly productService: ProductService) {}
  
    // TODO: Add admin guard
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@Query() searchDto: ProductSearchDto) {
      return await this.productService.findAllAdmin(searchDto);
    }
  
    // TODO: Add admin guard
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
      return await this.productService.findOne(id);
    }
  
    // TODO: Add admin guard
    @Patch(':id/hide')
    @HttpCode(HttpStatus.OK)
    async hide(@Param('id') id: string): Promise<ProductResponseDto> {
      return await this.productService.hideProduct(id);
    }
  
    // TODO: Add admin guard
    @Patch(':id/unhide')
    @HttpCode(HttpStatus.OK)
    async unhide(@Param('id') id: string): Promise<ProductResponseDto> {
      return await this.productService.unhideProduct(id);
    }
  }