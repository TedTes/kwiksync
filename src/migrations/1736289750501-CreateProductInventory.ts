import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductInventory1736289750501 implements MigrationInterface {
    name = 'CreateProductInventory1736289750501'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_inventory" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL DEFAULT '0', "restockThreshold" integer NOT NULL DEFAULT '10', "restockAmount" integer, "location" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "productId" integer, CONSTRAINT "PK_84e9362e0a5bf063e561d9452ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product_inventory" ADD CONSTRAINT "FK_3a5217b38a320b18071ab4e127c" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_inventory" DROP CONSTRAINT "FK_3a5217b38a320b18071ab4e127c"`);
        await queryRunner.query(`DROP TABLE "product_inventory"`);
    }

}
