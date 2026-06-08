import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductStatus } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductSearchDto, ProductSortBy } from './dto/product-search.dto';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly imageRepo: Repository<ProductImage>,
  ) {}

  // ─── Product CRUD ───

  async createProduct(product: Partial<Product>): Promise<Product> {
    const newProduct = this.productRepo.create(product);
    return await this.productRepo.save(newProduct);
  }

  async findById(id: string): Promise<Product | null> {
    return await this.productRepo.findOne({
      where: { id },
      relations: ['images', 'categories'],
    });
  }

  async findByStoreIdAndSlug(storeId: string, slug: string): Promise<Product | null> {
    return await this.productRepo.findOne({
      where: { storeId, slug },
      relations: ['images', 'categories'],
    });
  }

  async findByStoreId(storeId: string): Promise<Product[]> {
    return await this.productRepo.find({
      where: { storeId },
      relations: ['images', 'categories'],
      order: { createdAt: 'DESC' },
    });
  }

  async countByStoreId(storeId: string): Promise<number> {
    return await this.productRepo.count({ where: { storeId } });
  }

  async findPublishedByStoreSlug(storeSlug: string): Promise<Product[]> {
    return await this.productRepo
      .createQueryBuilder('product')
      .innerJoin('product.store', 'store')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.categories', 'categories')
      .where('store.slug = :storeSlug', { storeSlug })
      .andWhere('store.status = :storeStatus', { storeStatus: 'ACTIVE' })
      .andWhere('product.status = :productStatus', { productStatus: ProductStatus.PUBLISHED })
      .orderBy('product.createdAt', 'DESC')
      .getMany();
  }

  async searchPublished(searchDto: ProductSearchDto): Promise<{ data: Product[]; total: number }> {
    const qb = this.productRepo
      .createQueryBuilder('product')
      .innerJoin('product.store', 'store')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.categories', 'categories')
      .where('product.status = :status', { status: ProductStatus.PUBLISHED })
      .andWhere('store.status = :storeStatus', { storeStatus: 'ACTIVE' });

    if (searchDto.q) {
      qb.andWhere(
        '(product.name ILIKE :q OR product.description ILIKE :q)',
        { q: `%${searchDto.q}%` },
      );
    }

    if (searchDto.categoryId) {
      qb.innerJoin('product.categories', 'filterCat', 'filterCat.id = :categoryId', {
        categoryId: searchDto.categoryId,
      });
    }

    if (searchDto.storeId) {
      qb.andWhere('product.storeId = :storeId', { storeId: searchDto.storeId });
    }

    if (searchDto.minPrice !== undefined) {
      qb.andWhere('product.price >= :minPrice', { minPrice: searchDto.minPrice });
    }
    if (searchDto.maxPrice !== undefined) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice: searchDto.maxPrice });
    }

    switch (searchDto.sortBy) {
      case ProductSortBy.PRICE_ASC:
        qb.orderBy('product.price', 'ASC');
        break;
      case ProductSortBy.PRICE_DESC:
        qb.orderBy('product.price', 'DESC');
        break;
      case ProductSortBy.NAME:
        qb.orderBy('product.name', 'ASC');
        break;
      case ProductSortBy.CREATED_AT:
      default:
        qb.orderBy('product.createdAt', 'DESC');
        break;
    }

    const page = searchDto.page || 1;
    const limit = searchDto.limit || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();
    return { data, total };
  }

  async findAllAdmin(searchDto?: ProductSearchDto): Promise<{ data: Product[]; total: number }> {
    const qb = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.categories', 'categories')
      .leftJoinAndSelect('product.store', 'store');

    if (searchDto?.q) {
      qb.andWhere(
        '(product.name ILIKE :q OR product.description ILIKE :q)',
        { q: `%${searchDto.q}%` },
      );
    }

    if (searchDto?.storeId) {
      qb.andWhere('product.storeId = :storeId', { storeId: searchDto.storeId });
    }

    const page = searchDto?.page || 1;
    const limit = searchDto?.limit || 20;
    const skip = (page - 1) * limit;

    qb.orderBy('product.createdAt', 'DESC');
    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();
    return { data, total };
  }

  async updateProduct(product: Product): Promise<Product> {
    return await this.productRepo.save(product);
  }

  async softDelete(id: string): Promise<void> {
    await this.productRepo.softDelete(id);
  }

  // ─── Images ───

  async createImage(image: Partial<ProductImage>): Promise<ProductImage> {
    const newImage = this.imageRepo.create(image);
    return await this.imageRepo.save(newImage);
  }

  async findImageById(id: string): Promise<ProductImage | null> {
    return await this.imageRepo.findOne({ where: { id } });
  }

  async countImagesByProductId(productId: string): Promise<number> {
    return await this.imageRepo.count({ where: { productId } });
  }

  async removeImage(image: ProductImage): Promise<void> {
    await this.imageRepo.remove(image);
  }

  // ─── Category Products ───

  async findPublishedByCategoryId(
    categoryId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: Product[]; total: number }> {
    const skip = (page - 1) * limit;

    const qb = this.productRepo
      .createQueryBuilder('product')
      .innerJoin('product.store', 'store')
      .innerJoin('product.categories', 'category', 'category.id = :categoryId', { categoryId })
      .leftJoinAndSelect('product.images', 'images')
      .where('product.status = :status', { status: ProductStatus.PUBLISHED })
      .andWhere('store.status = :storeStatus', { storeStatus: 'ACTIVE' })
      .orderBy('product.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }
}