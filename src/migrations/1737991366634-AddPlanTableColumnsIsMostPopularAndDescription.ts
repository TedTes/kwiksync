import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPlanTableColumnsIsMostPopularAndDescription1737991366634 implements MigrationInterface {
    name = 'AddPlanTableColumnsIsMostPopularAndDescription1737991366634'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plan" ADD "isMostPopular" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "isMostPopular"`);
        await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "description"`);
    }

}
