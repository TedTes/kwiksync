import { MigrationInterface, QueryRunner } from "typeorm";

export class ColumnRefactoring1735577707774 implements MigrationInterface {
    name = 'ColumnRefactoring1735577707774'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trending_product" DROP COLUMN "merchantId"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_62fcc319202f6ec1f6819e1d5f5"`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "merchantId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "trending_product" DROP CONSTRAINT "FK_822e0342ac328a82d52c64f6a65"`);
        await queryRunner.query(`ALTER TABLE "trending_product" ALTER COLUMN "productId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "merchantId"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "merchantId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_62fcc319202f6ec1f6819e1d5f5" FOREIGN KEY ("merchantId") REFERENCES "merchant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trending_product" ADD CONSTRAINT "FK_822e0342ac328a82d52c64f6a65" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trending_product" DROP CONSTRAINT "FK_822e0342ac328a82d52c64f6a65"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_62fcc319202f6ec1f6819e1d5f5"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "merchantId"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "merchantId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "trending_product" ALTER COLUMN "productId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "trending_product" ADD CONSTRAINT "FK_822e0342ac328a82d52c64f6a65" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "merchantId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_62fcc319202f6ec1f6819e1d5f5" FOREIGN KEY ("merchantId") REFERENCES "merchant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trending_product" ADD "merchantId" character varying NOT NULL`);
    }

}
