import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductPlatform1736289988842 implements MigrationInterface {
    name = 'CreateProductPlatform1736289988842'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_platform" ("id" SERIAL NOT NULL, "platformPrice" numeric(10,2) NOT NULL, "platformSku" character varying, "isActive" boolean NOT NULL DEFAULT true, "listedAt" TIMESTAMP NOT NULL DEFAULT now(), "unlistedAt" TIMESTAMP, "productId" integer, "platformId" integer, CONSTRAINT "PK_8a856a4b0c824e49a347d65a0d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product_platform" ADD CONSTRAINT "FK_dec7261d55b360e3c2f09fc40e1" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_platform" ADD CONSTRAINT "FK_deddfa545dfda951571f51d800f" FOREIGN KEY ("platformId") REFERENCES "platform"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_platform" DROP CONSTRAINT "FK_deddfa545dfda951571f51d800f"`);
        await queryRunner.query(`ALTER TABLE "product_platform" DROP CONSTRAINT "FK_dec7261d55b360e3c2f09fc40e1"`);
        await queryRunner.query(`DROP TABLE "product_platform"`);
    }

}
