import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Product } from './product.entity';
  
  @Entity('product_images')
  export class ProductImage {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'uuid' })
    @Index()
    productId: string;
  
    @ManyToOne(() => Product, (product) => product.images, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'productId' })
    product: Product;
  
    @Column({ length: 500 })
    url: string;
  
    @Column({ length: 200, nullable: true })
    altText: string;
  
    @Column({ type: 'int', default: 0 })
    position: number;
  
    @Column({ default: false })
    isPrimary: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  }