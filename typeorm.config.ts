import 'reflect-metadata';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config({ path: join(__dirname, 'ecommerce', '.env') });

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'ecommerce',
  entities: [join(__dirname, 'ecommerce', 'src/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'ecommerce', 'src/migrations/*{.ts,.js}')],
  synchronize: false,
  logging: true,
});
