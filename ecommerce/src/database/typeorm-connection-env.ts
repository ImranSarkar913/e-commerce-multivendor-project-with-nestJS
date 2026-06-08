import type { ConfigService } from '@nestjs/config';

export type PostgresEnvConnection =
  | { url: string }
  | {
      host: string;
      port: number;
      username: string;
      password: string;
      database: string;
    };

function trim(value: string | undefined): string | undefined {
  if (value === undefined || value === null) return undefined;
  const s = String(value).trim();
  return s.length === 0 ? undefined : s;
}

/** For CLI (`typeorm-data-source.ts`) after `dotenv` loads `process.env`. */
export function postgresConnectionFromProcessEnv(): PostgresEnvConnection {
  const url = trim(process.env.DATABASE_URL);
  if (url) return { url };

  return {
    host: trim(process.env.DB_HOST) ?? 'localhost',
    port: parseInt(trim(process.env.DB_PORT) ?? '5432', 10),
    username: trim(process.env.DB_USERNAME) ?? 'postgres',
    password: trim(process.env.DB_PASSWORD) ?? 'postgres',
    database: trim(process.env.DB_NAME) ?? 'ecommerce',
  };
}

/** For Nest `ConfigModule` / `ConfigService`. */
export function postgresConnectionFromConfig(
  config: ConfigService,
): PostgresEnvConnection {
  const url = trim(config.get<string>('DATABASE_URL'));
  if (url) return { url };

  return {
    host: trim(config.get<string>('DB_HOST')) ?? 'localhost',
    port: parseInt(trim(config.get<string>('DB_PORT')) ?? '5432', 10),
    username: trim(config.get<string>('DB_USERNAME')) ?? 'postgres',
    password: trim(config.get<string>('DB_PASSWORD')) ?? 'postgres',
    database: trim(config.get<string>('DB_NAME')) ?? 'ecommerce',
  };
}
