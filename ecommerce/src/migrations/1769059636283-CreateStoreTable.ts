import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStoreTable1769059636283 implements MigrationInterface {
    name = 'CreateStoreTable1769059636283'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP CONSTRAINT "FK_user_subscriptions_userId"`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP CONSTRAINT "FK_user_subscriptions_subscriptionId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_user_subscriptions_userId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_user_subscriptions_subscriptionId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_user_subscriptions_status"`);
        await queryRunner.query(`CREATE TYPE "public"."stores_status_enum" AS ENUM('PENDING_APPROVAL', 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'REJECTED')`);
        await queryRunner.query(`CREATE TABLE "stores" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "name" character varying(100) NOT NULL, "slug" character varying(100) NOT NULL, "description" text, "logo" character varying(500), "status" "public"."stores_status_enum" NOT NULL DEFAULT 'PENDING_APPROVAL', "contactEmail" character varying(255) NOT NULL, "contactPhone" character varying(20), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_790b2968701a6ff5ff383237765" UNIQUE ("slug"), CONSTRAINT "REL_f36d697e265ed99b80cae6984c" UNIQUE ("userId"), CONSTRAINT "PK_7aa6e7d71fa7acdd7ca43d7c9cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f36d697e265ed99b80cae6984c" ON "stores" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_790b2968701a6ff5ff38323776" ON "stores" ("slug") `);
        await queryRunner.query(`CREATE INDEX "IDX_53a5f515d8767f635e80b5159b" ON "stores" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_2dfab576863bc3f84d4f696227" ON "user_subscriptions" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b5091b035afc05879a7e130305" ON "user_subscriptions" ("subscriptionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5970e6723936d28477041ebf85" ON "user_subscriptions" ("status") `);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" ADD CONSTRAINT "FK_2dfab576863bc3f84d4f6962274" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" ADD CONSTRAINT "FK_b5091b035afc05879a7e130305d" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_f36d697e265ed99b80cae6984c9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_f36d697e265ed99b80cae6984c9"`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP CONSTRAINT "FK_b5091b035afc05879a7e130305d"`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP CONSTRAINT "FK_2dfab576863bc3f84d4f6962274"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5970e6723936d28477041ebf85"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b5091b035afc05879a7e130305"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2dfab576863bc3f84d4f696227"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_53a5f515d8767f635e80b5159b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_790b2968701a6ff5ff38323776"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f36d697e265ed99b80cae6984c"`);
        await queryRunner.query(`DROP TABLE "stores"`);
        await queryRunner.query(`DROP TYPE "public"."stores_status_enum"`);
        await queryRunner.query(`CREATE INDEX "IDX_user_subscriptions_status" ON "user_subscriptions" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_user_subscriptions_subscriptionId" ON "user_subscriptions" ("subscriptionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_user_subscriptions_userId" ON "user_subscriptions" ("userId") `);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" ADD CONSTRAINT "FK_user_subscriptions_subscriptionId" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" ADD CONSTRAINT "FK_user_subscriptions_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}