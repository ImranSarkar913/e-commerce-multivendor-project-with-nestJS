import { ProductStatus } from '../entities/product.entity';

export class ProductImageResponseDto {
  id: string;
  url: string;
  altText: string;
  position: number;
  isPrimary: boolean;

  constructor(partial: Partial<ProductImageResponseDto>) {
    Object.assign(this, partial);
  }
}

export class ProductResponseDto {
  id: string;
  storeId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number;
  sku: string;
  status: ProductStatus;
  quantity: number;
  isFeatured: boolean;
  publishedAt: Date | null;
  images?: ProductImageResponseDto[];
  categories?: { id: string; name: string; slug: string }[];
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ProductResponseDto>) {
    Object.assign(this, partial);
    if (partial['images']) {
      this.images = partial['images'].map(
        (img) => new ProductImageResponseDto(img),
      );
    }
  }
}