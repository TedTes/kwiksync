import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTrendingProductColumn1736789229051 implements MigrationInterface {
    name = 'UpdateTrendingProductColumn1736789229051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trending_product" ADD "revenue" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "trending_product" ADD "unitsSold" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "trending_product" ADD "platformId" integer`);
        await queryRunner.query(`ALTER TABLE "trending_product" ADD CONSTRAINT "FK_add99ecae0b855fde3bcf9c2c54" FOREIGN KEY ("platformId") REFERENCES "platform"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trending_product" DROP CONSTRAINT "FK_add99ecae0b855fde3bcf9c2c54"`);
        await queryRunner.query(`ALTER TABLE "trending_product" DROP COLUMN "platformId"`);
        await queryRunner.query(`ALTER TABLE "trending_product" DROP COLUMN "unitsSold"`);
        await queryRunner.query(`ALTER TABLE "trending_product" DROP COLUMN "revenue"`);
    }

}
