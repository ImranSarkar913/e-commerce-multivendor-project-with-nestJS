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
  import { CategoryService } from './category.service';
  import { CreateCategoryDto } from './dto/create-category.dto';
  import { UpdateCategoryDto } from './dto/update-category.dto';
  import { CategoryResponseDto } from './dto/category-response.dto';
  
  // Public category endpoints
  @Controller('categories')
  export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}
  
    // Public: List all active root categories with children
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<CategoryResponseDto[]> {
      return await this.categoryService.findAll();
    }
  
    // Public: Get category by slug
    @Get(':slug')
    @HttpCode(HttpStatus.OK)
    async findBySlug(@Param('slug') slug: string): Promise<CategoryResponseDto> {
      return await this.categoryService.findBySlug(slug);
    }
  }
  
  // Admin category endpoints
  @Controller('admin/categories')
  export class AdminCategoryController {
    constructor(private readonly categoryService: CategoryService) {}
  
    // Admin: List all categories
    // TODO: Add admin guard
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<CategoryResponseDto[]> {
      return await this.categoryService.findAllAdmin();
    }
  
    // Admin: Get category by ID
    // TODO: Add admin guard
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id: string): Promise<CategoryResponseDto> {
      return await this.categoryService.findOne(id);
    }
  
    // Admin: Create platform category
    // TODO: Add admin guard
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
      @Body() createCategoryDto: CreateCategoryDto,
    ): Promise<CategoryResponseDto> {
      return await this.categoryService.create(createCategoryDto);
    }
  
    // Admin: Update category
    // TODO: Add admin guard
    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(
      @Param('id') id: string,
      @Body() updateCategoryDto: UpdateCategoryDto,
    ): Promise<CategoryResponseDto> {
      return await this.categoryService.update(id, updateCategoryDto);
    }
  
    // Admin: Delete category
    // TODO: Add admin guard
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string): Promise<void> {
      return await this.categoryService.remove(id);
    }
  }