import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {}

  async create(category: Partial<Category>): Promise<Category> {
    const newCategory = this.repository.create(category);
    return await this.repository.save(newCategory);
  }

  async findAll(): Promise<Category[]> {
    return await this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findAllActive(): Promise<Category[]> {
    return await this.repository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return await this.repository.findOne({ where: { slug } });
  }

  async update(category: Category): Promise<Category> {
    return await this.repository.save(category);
  }

  async remove(category: Category): Promise<void> {
    await this.repository.remove(category);
  }
}