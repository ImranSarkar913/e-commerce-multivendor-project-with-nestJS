import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  StoreProductController,
  PublicProductController,
  StorePublicProductController,
  CategoryProductController,
  AdminProductController,
} from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { StoreModule } from '../store/store.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage]),
    StoreModule,
    CategoryModule,
  ],
  controllers: [
    StoreProductController,
    PublicProductController,
    StorePublicProductController,
    CategoryProductController,
    AdminProductController,
  ],
  providers: [ProductService, ProductRepository],
  exports: [ProductService],
})
export class ProductModule {}