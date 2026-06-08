import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductModule1770979033918 implements MigrationInterface {
    name = 'CreateProductModule1770979033918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "slug" character varying(200) NOT NULL, "description" text, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_420d9f679d41281f282f5bc7d0" ON "categories" ("slug") `);
        await queryRunner.query(`CREATE TYPE "public"."products_status_enum" AS ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED', 'HIDDEN')`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "storeId" uuid NOT NULL, "name" character varying(200) NOT NULL, "slug" character varying(200) NOT NULL, "description" text, "price" numeric(10,2) NOT NULL, "compareAtPrice" numeric(10,2), "sku" character varying(100), "status" "public"."products_status_enum" NOT NULL DEFAULT 'DRAFT', "quantity" integer NOT NULL DEFAULT '0', "isFeatured" boolean NOT NULL DEFAULT false, "publishedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_782da5e50e94b763eb63225d69" ON "products" ("storeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1846199852a695713b1f8f5e9a" ON "products" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_63fcb3d8806a6efd53dbc67430" ON "products" ("createdAt") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9844b96a2b5b3620eee675f805" ON "products" ("storeId", "slug") `);
        await queryRunner.query(`CREATE TABLE "product_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productId" uuid NOT NULL, "url" character varying(500) NOT NULL, "altText" character varying(200), "position" integer NOT NULL DEFAULT '0', "isPrimary" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1974264ea7265989af8392f63a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b367708bf720c8dd62fc683316" ON "product_images" ("productId") `);
        await queryRunner.query(`CREATE TABLE "product_categories" ("productId" uuid NOT NULL, "categoryId" uuid NOT NULL, CONSTRAINT "PK_e65c1adebf00d61f1c84a4f3950" PRIMARY KEY ("productId", "categoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6156a79599e274ee9d83b1de13" ON "product_categories" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fdef3adba0c284fd103d0fd369" ON "product_categories" ("categoryId") `);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_782da5e50e94b763eb63225d69d" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD CONSTRAINT "FK_b367708bf720c8dd62fc6833161" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD CONSTRAINT "FK_6156a79599e274ee9d83b1de139" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD CONSTRAINT "FK_fdef3adba0c284fd103d0fd3697" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT "FK_fdef3adba0c284fd103d0fd3697"`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT "FK_6156a79599e274ee9d83b1de139"`);
        await queryRunner.query(`ALTER TABLE "product_images" DROP CONSTRAINT "FK_b367708bf720c8dd62fc6833161"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_782da5e50e94b763eb63225d69d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fdef3adba0c284fd103d0fd369"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6156a79599e274ee9d83b1de13"`);
        await queryRunner.query(`DROP TABLE "product_categories"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b367708bf720c8dd62fc683316"`);
        await queryRunner.query(`DROP TABLE "product_images"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9844b96a2b5b3620eee675f805"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_63fcb3d8806a6efd53dbc67430"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1846199852a695713b1f8f5e9a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_782da5e50e94b763eb63225d69"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TYPE "public"."products_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_420d9f679d41281f282f5bc7d0"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
