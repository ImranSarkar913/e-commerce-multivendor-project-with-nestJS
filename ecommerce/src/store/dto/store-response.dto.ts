import { StoreStatus } from '../entities/store.entity';

export class StoreResponseDto {
  id: string;
  userId: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  status: StoreStatus;
  contactEmail: string;
  contactPhone: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<StoreResponseDto>) {
    Object.assign(this, partial);
  }
}