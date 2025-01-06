import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSalesTable1736186720627 implements MigrationInterface {
    name = 'CreateSalesTable1736186720627'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sales" ("id" SERIAL NOT NULL, "quantitySold" integer NOT NULL, "totalRevenue" numeric(10,2) NOT NULL, "saleDate" TIMESTAMP NOT NULL DEFAULT now(), "productId" integer, CONSTRAINT "PK_4f0bc990ae81dba46da680895ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sales" ADD CONSTRAINT "FK_58de77cc0543589490a33558b8e" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales" DROP CONSTRAINT "FK_58de77cc0543589490a33558b8e"`);
        await queryRunner.query(`DROP TABLE "sales"`);
    }

}
