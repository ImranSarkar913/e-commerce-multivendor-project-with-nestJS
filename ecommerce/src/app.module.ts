import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { postgresConnectionFromConfig } from './database/typeorm-connection-env';
import { UserModule } from './user/user.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { UserSubscriptionModule } from './user-subscription/user-subscription.module';
import { StoreModule } from './store/store.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        ...postgresConnectionFromConfig(configService),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: false, // Set to false - we'll use migrations
        logging: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    SubscriptionModule,
    UserSubscriptionModule,
    StoreModule,
    CategoryModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}