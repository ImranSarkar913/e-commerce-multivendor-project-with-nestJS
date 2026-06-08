# E-commerce API (NestJS)

This repository contains an E-commerce API built with NestJS and TypeORM. The main application is inside the `ecommerce/` folder.

## Quick overview

- **Framework:** NestJS
- **ORM:** TypeORM
- **Database:** PostgreSQL (recommended)

## Prerequisites

- Node.js 18+ (or compatible)
- npm or yarn
- PostgreSQL (or another DB supported by TypeORM)

## Install

Install dependencies for the root (migration helpers) and the `ecommerce` app:

```bash
npm install
cd ecommerce
npm install
```

## Run (development)

From the `ecommerce` folder:

```bash
cd ecommerce
npm run start:dev
```

The app uses `@nestjs/config` and `dotenv` — create a `.env` file in `ecommerce/` or set environment variables directly.

## Environment variables (example)

Create `ecommerce/.env` with values similar to:

```
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ecommerce_db
```

The project also includes a TypeORM data source at `ecommerce/typeorm-data-source.ts` which is used by migration scripts.

## Migrations

You can run and manage migrations from the repository root or from the `ecommerce` package:

- From root (convenience scripts):

```bash
npm run migration:run
npm run migration:revert
npm run migration:generate -- --name AddSomething
npm run migration:create -- --name NewMigration
```

- Or directly inside `ecommerce`:

```bash
cd ecommerce
npm run migration:run
```

The `ecommerce` package.json uses `typeorm-ts-node-commonjs` and points migrations at `./typeorm-data-source.ts`.

## Build & Production

```bash
cd ecommerce
npm run build
npm run start:prod
```

## Tests

Run unit tests and e2e tests from `ecommerce`:

```bash
cd ecommerce
npm run test
npm run test:e2e
```

## Project structure (high level)

- `ecommerce/src` - main application source
  - `category/` - category module
  - `product/` - product module
  - `store/` - store module
  - `user/`, `subscription/`, `user-subscription/` - domain modules
  - `database/` - DB connection helpers
  - `migrations/` - generated migrations

- `ecommerce/test` - e2e tests
- `ecommerce/typeorm-data-source.ts` - TypeORM data source config

## Useful scripts

- Root (helpers for migrations): `npm run migration:run`, `migration:generate`, etc.
- In `ecommerce/`:
  - `npm run start:dev` — development server
  - `npm run build` — build dist
  - `npm run start:prod` — run built app
  - `npm run test` — run unit tests
  - `npm run test:e2e` — run e2e tests

## Contributing

Open an issue or submit a pull request. Follow existing code style and run tests before submitting.

## License

See `ecommerce/package.json` for the package license information.
