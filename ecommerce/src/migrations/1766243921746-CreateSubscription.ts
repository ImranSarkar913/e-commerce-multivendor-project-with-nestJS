import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSubscription1766243921746 implements MigrationInterface {
    name = 'CreateSubscription1766243921746'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."subscriptions_plan_enum" AS ENUM('BASIC', 'STANDARD', 'PREMIUM')`);
        await queryRunner.query(`CREATE TYPE "public"."subscriptions_status_enum" AS ENUM('ACTIVE', 'EXPIRED', 'CANCELLED', 'SUSPENDED')`);
        await queryRunner.query(`CREATE TABLE "subscriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "price" integer NOT NULL, "currency" character varying NOT NULL, "plan" "public"."subscriptions_plan_enum" NOT NULL DEFAULT 'BASIC', "status" "public"."subscriptions_status_enum" NOT NULL DEFAULT 'ACTIVE', "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "autoRenew" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e03f7748dc1247e31dc8078fee7" UNIQUE ("name"), CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6ccf973355b70645eff37774de" ON "subscriptions" ("status") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_6ccf973355b70645eff37774de"`);
        await queryRunner.query(`DROP TABLE "subscriptions"`);
        await queryRunner.query(`DROP TYPE "public"."subscriptions_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."subscriptions_plan_enum"`);
    }

}