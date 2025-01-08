import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductColumn1736356104507 implements MigrationInterface {
    name = 'UpdateProductColumn1736356104507'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "quantity"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "quantity" integer NOT NULL DEFAULT '0'`);
    }

}
