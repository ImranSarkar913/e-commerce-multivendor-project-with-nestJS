import {
    Injectable,
    NotFoundException,
    ConflictException,
  } from '@nestjs/common';
  import { CategoryRepository } from './category.repository';
  import { CreateCategoryDto } from './dto/create-category.dto';
  import { UpdateCategoryDto } from './dto/update-category.dto';
  import { CategoryResponseDto } from './dto/category-response.dto';
  
  @Injectable()
  export class CategoryService {
    constructor(private readonly categoryRepository: CategoryRepository) {}
  
    async create(createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
      const slug = createCategoryDto.slug || this.createSlug(createCategoryDto.name);
  
      const existing = await this.categoryRepository.findBySlug(slug);
      if (existing) {
        throw new ConflictException(`Category with slug '${slug}' already exists`);
      }
  
      const category = await this.categoryRepository.create({
        ...createCategoryDto,
        slug,
      });
  
      return new CategoryResponseDto(category);
    }
  
    async findAll(): Promise<CategoryResponseDto[]> {
      const categories = await this.categoryRepository.findAllActive();
      return categories.map((cat) => new CategoryResponseDto(cat));
    }
  
    async findAllAdmin(): Promise<CategoryResponseDto[]> {
      const categories = await this.categoryRepository.findAll();
      return categories.map((cat) => new CategoryResponseDto(cat));
    }
  
    async findOne(id: string): Promise<CategoryResponseDto> {
      const category = await this.categoryRepository.findById(id);
      if (!category) {
        throw new NotFoundException(`Category with ID '${id}' not found`);
      }
      return new CategoryResponseDto(category);
    }
  
    async findBySlug(slug: string): Promise<CategoryResponseDto> {
      const category = await this.categoryRepository.findBySlug(slug);
      if (!category) {
        throw new NotFoundException(`Category with slug '${slug}' not found`);
      }
      return new CategoryResponseDto(category);
    }
  
    async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryResponseDto> {
      const category = await this.categoryRepository.findById(id);
      if (!category) {
        throw new NotFoundException(`Category with ID '${id}' not found`);
      }
  
      if (updateCategoryDto.slug && updateCategoryDto.slug !== category.slug) {
        const existing = await this.categoryRepository.findBySlug(updateCategoryDto.slug);
        if (existing) {
          throw new ConflictException(`Category with slug '${updateCategoryDto.slug}' already exists`);
        }
      }
  
      Object.assign(category, updateCategoryDto);
      const updated = await this.categoryRepository.update(category);
      return new CategoryResponseDto(updated);
    }
  
    async remove(id: string): Promise<void> {
      const category = await this.categoryRepository.findById(id);
      if (!category) {
        throw new NotFoundException(`Category with ID '${id}' not found`);
      }
      await this.categoryRepository.remove(category);
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