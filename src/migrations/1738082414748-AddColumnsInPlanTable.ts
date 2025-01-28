import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnsInPlanTable1738082414748 implements MigrationInterface {
  name = "AddColumnsInPlanTable1738082414748";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "monthlyPrice"`);
    await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "annualPrice"`);
    await queryRunner.query(
      `ALTER TABLE "plan" ADD "monthlyPriceInCents" bigint NOT NULL DEFAULT 0`
    );
    await queryRunner.query(
      `ALTER TABLE "plan" ADD "annualPriceInCents" bigint NOT NULL DEFAULT 0`
    );
    await queryRunner.query(
      `ALTER TABLE "plan" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "plan" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "features"`);
    await queryRunner.query(`ALTER TABLE "plan" ADD "features" jsonb`);
    await queryRunner.query(
      `ALTER TABLE "plan" ALTER COLUMN "isActive" SET DEFAULT true`
    );
    await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "plan" ADD "description" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "description"`);
    await queryRunner.query(
      `ALTER TABLE "plan" ADD "description" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "plan" ALTER COLUMN "isActive" DROP DEFAULT`
    );
    await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "features"`);
    await queryRunner.query(`ALTER TABLE "plan" ADD "features" text NOT NULL`);
    await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "plan" DROP COLUMN "annualPriceInCents"`
    );
    await queryRunner.query(
      `ALTER TABLE "plan" DROP COLUMN "monthlyPriceInCents"`
    );
    await queryRunner.query(
      `ALTER TABLE "plan" ADD "annualPrice" numeric NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "plan" ADD "monthlyPrice" numeric NOT NULL`
    );
  }
}
