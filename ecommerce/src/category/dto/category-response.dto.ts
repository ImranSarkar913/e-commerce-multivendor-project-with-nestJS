export class CategoryResponseDto {
    id: string;
    name: string;
    slug: string;
    description: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  
    constructor(partial: Partial<CategoryResponseDto>) {
      Object.assign(this, partial);
    }
  }