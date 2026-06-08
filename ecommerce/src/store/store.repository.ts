import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store, StoreStatus } from './entities/store.entity';
import { StoreSearchDto } from './dto/store-search.dto';

@Injectable()
export class StoreRepository {
  constructor(
    @InjectRepository(Store)
    private readonly repository: Repository<Store>,
  ) {}

  async create(store: Partial<Store>): Promise<Store> {
    const newStore = this.repository.create(store);
    return await this.repository.save(newStore);
  }

  async findAllWithConfig(searchConfig: StoreSearchDto): Promise<Store[]> {
    const qb = this.repository.createQueryBuilder('store');
    if (searchConfig.status) {
      qb.andWhere('store.status = :status', { status: searchConfig.status });
    }
    if (searchConfig.name) {
      qb.andWhere('store.name ILIKE :name', { name: `%${searchConfig.name}%` });
    }
    if (searchConfig.slug) {
      qb.andWhere('store.slug = :slug', { slug: searchConfig.slug });
    }
    if (searchConfig.contactEmail) {
      qb.andWhere('store.contactEmail = :contactEmail', { contactEmail: searchConfig.contactEmail });
    }
    if (searchConfig.contactPhone) {
      qb.andWhere('store.contactPhone = :contactPhone', { contactPhone: searchConfig.contactPhone });
    }
    if (searchConfig.search) {
      qb.andWhere(
        '(store.name ILIKE :search OR store.description ILIKE :search OR store.slug ILIKE :search)',
        { search: `%${searchConfig.search}%` },
      );
    }
    qb.orderBy('store.createdAt', 'DESC');
    return qb.getMany();
  }

  async findAllActive(): Promise<Store[]> {
    return await this.repository.find({
      where: { status: StoreStatus.ACTIVE },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Store | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async findBySlug(slug: string): Promise<Store | null> {
    return await this.repository.findOne({
      where: { slug },
    });
  }

  async findByUserId(userId: string): Promise<Store | null> {
    return await this.repository.findOne({
      where: { userId },
    });
  }

  async update(store: Store): Promise<Store> {
    return await this.repository.save(store);
  }

  async remove(store: Store): Promise<void> {
    await this.repository.remove(store);
  }
}