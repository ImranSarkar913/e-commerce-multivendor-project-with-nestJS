import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    OneToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from '../../user/entities/user.entity';
  
  export enum StoreStatus {
    PENDING_APPROVAL = 'PENDING_APPROVAL',
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
    REJECTED = 'REJECTED',
  }
  
  @Entity('stores')
  export class Store {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'uuid' })
    @Index()
    userId: string;
  
    @OneToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;
  
    @Column({ length: 100 })
    name: string;
  
    @Column({ length: 100, unique: true })
    @Index()
    slug: string;
    
  
    @Column({ type: 'text', nullable: true })
    description: string;
  
    @Column({ length: 500, nullable: true })
    logo: string;
  
    @Column({
      type: 'enum',
      enum: StoreStatus,
      default: StoreStatus.PENDING_APPROVAL,
    })
    @Index()
    status: StoreStatus;
  
    @Column({ length: 255 })
    contactEmail: string;
  
    @Column({ length: 20, nullable: true })
    contactPhone: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }