import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
  } from 'typeorm';
  
  export enum UserRole {
    SYSTEM_ADMIN = 'SYSTEM_ADMIN',
    CUSTOMER = 'CUSTOMER',
    VENDOR = 'VENDOR',
  }
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ unique: true })
    @Index()
    email: string;
  
    @Column()
    password: string; 
  
    @Column({ nullable: true })
    firstName: string;
  
    @Column({ nullable: true })
    lastName: string;
  
    @Column({
      type: 'enum',
      enum: UserRole,
    })
    @Index()
    role: UserRole;
  
    @Column({ default: true })
    isActive: boolean;
  
    @Column({ default: false })
    isSuspended: boolean;
  
    @Column({ nullable: true })
    suspendedAt: Date;
  
    @Column({ type: 'uuid', nullable: true })
    suspendedBy: string; // Admin ID who suspended the user
  
    @Column({ type: 'text', nullable: true })
    suspensionReason: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }