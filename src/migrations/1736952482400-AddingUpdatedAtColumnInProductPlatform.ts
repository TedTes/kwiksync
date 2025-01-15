import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingUpdatedAtColumnInProductPlatform1736952482400 implements MigrationInterface {
    name = 'AddingUpdatedAtColumnInProductPlatform1736952482400'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_platform" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_platform" DROP COLUMN "updatedAt"`);
    }

}
