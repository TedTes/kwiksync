import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMerchantProductTable1736277354673 implements MigrationInterface {
    name = 'CreateMerchantProductTable1736277354673'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "merchant_product" ("id" SERIAL NOT NULL, "sellingPrice" numeric(10,2) NOT NULL, "stockQuantity" integer NOT NULL DEFAULT '0', "listedDate" TIMESTAMP NOT NULL DEFAULT now(), "unlistedDate" TIMESTAMP, "isActive" boolean NOT NULL DEFAULT true, "merchantId" integer, "productId" integer, CONSTRAINT "PK_18b429ac7fe9530c3056f4ec04c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "merchant_product" ADD CONSTRAINT "FK_0f4ca5fff5c79a7f361374751d6" FOREIGN KEY ("merchantId") REFERENCES "merchant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "merchant_product" ADD CONSTRAINT "FK_2216fa755a8906a31c994c150b2" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merchant_product" DROP CONSTRAINT "FK_2216fa755a8906a31c994c150b2"`);
        await queryRunner.query(`ALTER TABLE "merchant_product" DROP CONSTRAINT "FK_0f4ca5fff5c79a7f361374751d6"`);
        await queryRunner.query(`DROP TABLE "merchant_product"`);
    }

}
