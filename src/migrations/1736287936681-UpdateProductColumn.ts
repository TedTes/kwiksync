import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductColumn1736287936681 implements MigrationInterface {
    name = 'UpdateProductColumn1736287936681'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "restockThreshold"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "restockAmount"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "basePrice" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "sku" character varying NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "product" ADD "metadata" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "sku"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "basePrice"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "restockAmount" integer`);
        await queryRunner.query(`ALTER TABLE "product" ADD "restockThreshold" integer NOT NULL DEFAULT '10'`);
    }

}
