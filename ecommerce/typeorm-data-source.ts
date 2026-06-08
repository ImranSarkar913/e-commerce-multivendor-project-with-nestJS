import 'reflect-metadata';
import { join } from 'path';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { postgresConnectionFromProcessEnv } from './src/database/typeorm-connection-env';

config({ path: join(__dirname, '.env') });

export default new DataSource({
  type: 'postgres',
  ...postgresConnectionFromProcessEnv(),
  entities: [join(__dirname, 'src/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'src/migrations/*{.ts,.js}')],
  synchronize: false,
  logging: true,
});
