import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingCategoryInProductColumn1736950261491
  implements MigrationInterface
{
  name = "AddingCategoryInProductColumn1736950261491";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" ADD "category" character varying NOT NULL DEFAULT 'Uncategorized'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "trending_product" DROP CONSTRAINT "FK_add99ecae0b855fde3bcf9c2c54"`
    );
  }
}
