import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
  } from 'typeorm';
  
  export enum SubscriptionStatus {
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
    CANCELLED = 'CANCELLED',
    SUSPENDED = 'SUSPENDED',
  }
  
  export enum SubscriptionPlan {
    BASIC = 'BASIC',
    STANDARD = 'STANDARD',
    PREMIUM = 'PREMIUM',
  }
  
  @Entity('subscriptions')
  export class Subscription {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({
      nullable: false,
      unique: true,
    })
    name: string;
  
    @Column()
    description: string;
  
    @Column()
    price: number;
  
    @Column()
    currency: string;
  
    @Column({
      type: 'enum',
      enum: SubscriptionPlan,
      default: SubscriptionPlan.BASIC,
    })
    plan: SubscriptionPlan;
  
    @Column({
      type: 'enum',
      enum: SubscriptionStatus,
      default: SubscriptionStatus.ACTIVE,
    })
    @Index()
    status: SubscriptionStatus;
  
    @Column({ default: false })
    autoRenew: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }