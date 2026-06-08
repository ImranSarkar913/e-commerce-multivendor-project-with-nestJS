import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
  } from 'typeorm';
  
  @Entity('categories')
  export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ length: 200 })
    name: string;
  
    @Column({ length: 200, unique: true })
    @Index()
    slug: string;
  
    @Column({ type: 'text', nullable: true })
    description: string;
  
    @Column({ default: true })
    isActive: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }