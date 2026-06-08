import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1764412529593 implements MigrationInterface {
    name = 'CreateUserTable1764412529593'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('SYSTEM_ADMIN', 'CUSTOMER', 'VENDOR')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "role" "public"."users_role_enum" NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "isSuspended" boolean NOT NULL DEFAULT false, "suspendedAt" TIMESTAMP, "suspendedBy" uuid, "suspensionReason" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_ace513fa30d485cfd25c11a9e4" ON "users" ("role") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_ace513fa30d485cfd25c11a9e4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}