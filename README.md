# NestJS E-commerce API

A production-style E-commerce API built with NestJS, TypeORM, and PostgreSQL.

The main application lives in the `ecommerce/` folder. The root workspace provides convenience scripts for migrations and top-level TypeScript support.

## Key features

- Modular NestJS architecture
- PostgreSQL integration with TypeORM
- Validation with `class-validator` and `class-transformer`
- Environment-based configuration via `@nestjs/config`
- Migration-driven database schema management
- Unit and end-to-end test setup with Jest

## Prerequisites

- Node.js 18+ (or compatible)
- npm
- PostgreSQL

## Setup

From the repository root:

```bash
npm install
cd ecommerce
npm install
```

## Environment configuration

Create a `.env` file inside `ecommerce/` with your database and runtime settings.

Example `ecommerce/.env`:

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ecommerce_db
```

## Running the app

Start the development server from the `ecommerce` folder:

```bash
cd ecommerce
npm run start:dev
```

The application listens on `process.env.PORT` or defaults to `3000`.

## Build and production

Build the application and run the compiled output:

```bash
cd ecommerce
npm run build
npm run start:prod
```

## Database migrations

The project includes TypeORM migration scripts. Use these commands from the repository root:

```bash
npm run migration:run
npm run migration:revert
npm run migration:generate -- --name AddSomething
npm run migration:create -- --name NewMigration
```

Or run migrations directly from the `ecommerce` package:

```bash
cd ecommerce
npm run migration:run
```

## Tests

Run tests from the `ecommerce` folder:

```bash
cd ecommerce
npm run test
npm run test:e2e
```

## Project structure

- `ecommerce/src`
  - `app.module.ts` - application root and module imports
  - `main.ts` - bootstrap and global validation pipe
  - `database/typeorm-connection-env.ts` - PostgreSQL connection helper
  - `user/` - user domain module
  - `subscription/` - subscription domain module
  - `user-subscription/` - user subscription domain module
  - `store/` - store domain module
  - `category/` - category domain module
  - `product/` - product domain module
- `ecommerce/migrations/` - generated TypeORM migrations
- `ecommerce/test/` - end-to-end tests
- `ecommerce/typeorm-data-source.ts` - TypeORM CLI datasource config

## Available scripts

### Root scripts

- `npm run migration:run` — run database migrations
- `npm run migration:revert` — revert the last migration
- `npm run migration:generate -- --name <name>` — generate a new migration
- `npm run migration:create -- --name <name>` — create a new migration file
- `npm run typecheck:root` — run TypeScript type checking at the workspace root

### `ecommerce/` scripts

- `npm run start:dev` — start the app in watch mode
- `npm run build` — compile the app with NestJS
- `npm run start:prod` — start the production build
- `npm run lint` — run ESLint (fixes enabled)
- `npm run test` — run Jest unit tests
- `npm run test:e2e` — run end-to-end tests

## Notes

- The app uses `synchronize: false` in TypeORM configuration. Always apply schema changes through migrations.
- `ecommerce/src/main.ts` enables global validation with `whitelist`, `forbidNonWhitelisted`, and `transform`.
- The `ecommerce/README.md` currently contains the default NestJS starter content and is not specific to this project.

## Contributing

1. Fork the repository
2. Install dependencies
3. Add tests for new features or bug fixes
4. Submit a pull request with a clear description of changes

## License

This repository uses the license defined in `ecommerce/package.json`.
