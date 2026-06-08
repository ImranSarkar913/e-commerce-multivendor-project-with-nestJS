import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
  } from 'typeorm';
  import { User } from '../../user/entities/user.entity';
  import { Subscription } from '../../subscription/entities/subscription.entity';
  
  export enum UserSubscriptionStatus {
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
    CANCELLED = 'CANCELLED',
    PENDING = 'PENDING',
  }
  
  @Entity('user_subscriptions')
  export class UserSubscription {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'uuid' })
    @Index()
    userId: string;
  
    @Column({ type: 'uuid' })
    @Index()
    subscriptionId: string;
  
    @Column({ type: 'timestamp' })
    startDate: Date;
  
    @Column({ type: 'timestamp' })
    endDate: Date;
  
    @Column({
      type: 'enum',
      enum: UserSubscriptionStatus,
      default: UserSubscriptionStatus.PENDING,
    })
    @Index()
    status: UserSubscriptionStatus;
  
    @Column({ default: false })
    autoRenew: boolean;
  
    @Column({ type: 'uuid', nullable: true })
    paymentId: string;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;
  
    @ManyToOne(() => Subscription)
    @JoinColumn({ name: 'subscriptionId' })
    subscription: Subscription;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }