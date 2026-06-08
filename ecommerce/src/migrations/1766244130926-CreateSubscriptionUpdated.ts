import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSubscriptionUpdated1766244130926 implements MigrationInterface {
    name = 'CreateSubscriptionUpdated1766244130926'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "startDate"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "endDate"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "endDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "startDate" TIMESTAMP NOT NULL`);
    }

}