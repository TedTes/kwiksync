import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePaymentCustomerTable1738083688754
  implements MigrationInterface
{
  name = "CreatePaymentCustomerTable1738083688754";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "payment_customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "provider" character varying NOT NULL, "customerMetadata" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "merchantId" integer, CONSTRAINT "PK_e7abeb831f94d053cf4f3f20d80" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "payment_customers" ADD CONSTRAINT "FK_68fe714fcaf66867032d7fefaea" FOREIGN KEY ("merchantId") REFERENCES "merchant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_customers" DROP CONSTRAINT "FK_68fe714fcaf66867032d7fefaea"`
    );
    await queryRunner.query(`DROP TABLE "payment_customers"`);
  }
}
