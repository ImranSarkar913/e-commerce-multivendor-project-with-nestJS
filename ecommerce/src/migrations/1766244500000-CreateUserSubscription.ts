import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserSubscription1766244500000 implements MigrationInterface {
    name = 'CreateUserSubscription1766244500000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create enum for user subscription status
        await queryRunner.query(`CREATE TYPE "public"."user_subscriptions_status_enum" AS ENUM('ACTIVE', 'EXPIRED', 'CANCELLED', 'PENDING')`);

        // Create user_subscriptions table
        await queryRunner.query(`
            CREATE TABLE "user_subscriptions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" uuid NOT NULL,
                "subscriptionId" uuid NOT NULL,
                "startDate" TIMESTAMP NOT NULL,
                "endDate" TIMESTAMP NOT NULL,
                "status" "public"."user_subscriptions_status_enum" NOT NULL DEFAULT 'PENDING',
                "autoRenew" boolean NOT NULL DEFAULT false,
                "paymentId" uuid,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_user_subscriptions" PRIMARY KEY ("id")
            )
        `);

        // Create indexes
        await queryRunner.query(`CREATE INDEX "IDX_user_subscriptions_userId" ON "user_subscriptions" ("userId")`);
        await queryRunner.query(`CREATE INDEX "IDX_user_subscriptions_subscriptionId" ON "user_subscriptions" ("subscriptionId")`);
        await queryRunner.query(`CREATE INDEX "IDX_user_subscriptions_status" ON "user_subscriptions" ("status")`);

        // Add foreign key constraints
        await queryRunner.query(`
            ALTER TABLE "user_subscriptions"
            ADD CONSTRAINT "FK_user_subscriptions_userId"
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "user_subscriptions"
            ADD CONSTRAINT "FK_user_subscriptions_subscriptionId"
            FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign keys
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP CONSTRAINT "FK_user_subscriptions_subscriptionId"`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP CONSTRAINT "FK_user_subscriptions_userId"`);

        // Drop indexes
        await queryRunner.query(`DROP INDEX "public"."IDX_user_subscriptions_status"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_user_subscriptions_subscriptionId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_user_subscriptions_userId"`);

        // Drop table
        await queryRunner.query(`DROP TABLE "user_subscriptions"`);

        // Drop enum
        await queryRunner.query(`DROP TYPE "public"."user_subscriptions_status_enum"`);
    }
}