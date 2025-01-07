import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductColumns1736277032812 implements MigrationInterface {
  name = "UpdateProductColumns1736277032812";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_4346e4adb741e80f3711ee09ba4"`
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_62fcc319202f6ec1f6819e1d5f5"`
    );
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "merchantId"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "supplierId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" ADD "supplierId" integer`);
    await queryRunner.query(`ALTER TABLE "product" ADD "merchantId" integer`);
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_62fcc319202f6ec1f6819e1d5f5" FOREIGN KEY ("merchantId") REFERENCES "merchant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_4346e4adb741e80f3711ee09ba4" FOREIGN KEY ("supplierId") REFERENCES "supplier"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
  }
}
