import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Index,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinTable,
    JoinColumn,
  } from 'typeorm';
  import { Store } from '../../store/entities/store.entity';
  import { ProductImage } from './product-image.entity';
  import { Category } from '../../category/entities/category.entity';
  
  export enum ProductStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED',
    HIDDEN = 'HIDDEN',
  }
  
  @Entity('products')
  @Index(['storeId', 'slug'], { unique: true })
  export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'uuid' })
    @Index()
    storeId: string;
  
    @ManyToOne(() => Store, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    store: Store;
  
    @Column({ length: 200 })
    name: string;
  
    @Column({ length: 200 })
    slug: string;
  
    @Column({ type: 'text', nullable: true })
    description: string;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    compareAtPrice: number;
  
    @Column({ length: 100, nullable: true })
    sku: string;
  
    @Column({
      type: 'enum',
      enum: ProductStatus,
      default: ProductStatus.DRAFT,
    })
    @Index()
    status: ProductStatus;
  
    @Column({ type: 'int', default: 0 })
    quantity: number;
  
    @Column({ default: false })
    isFeatured: boolean;
  
    @Column({ type: 'timestamp', nullable: true })
    publishedAt: Date | null;
  
    @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
    images: ProductImage[];
  
    @ManyToMany(() => Category)
    @JoinTable({
      name: 'product_categories',
      joinColumn: { name: 'productId', referencedColumnName: 'id' },
      inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
    })
    categories: Category[];
  
    @CreateDateColumn()
    @Index()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date;
  }