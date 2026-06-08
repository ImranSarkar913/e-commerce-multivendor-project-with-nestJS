import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreController, AdminStoreController } from './store.controller';
import { StoreService } from './store.service';
import { StoreRepository } from './store.repository';
import { Store } from './entities/store.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Store]), UserModule],
  controllers: [StoreController, AdminStoreController],
  providers: [StoreService, StoreRepository],
  exports: [StoreService],
})
export class StoreModule {}