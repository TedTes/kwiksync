import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePlatformTable1736215138692 implements MigrationInterface {
    name = 'CreatePlatformTable1736215138692'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "platform" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b9b57ec16b9c2ac927aa62b8b3f" UNIQUE ("name"), CONSTRAINT "PK_c33d6abeebd214bd2850bfd6b8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_platforms" ("productId" integer NOT NULL, "platformId" integer NOT NULL, CONSTRAINT "PK_58dea9828ed8d1fb682fdacf05a" PRIMARY KEY ("productId", "platformId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d0b3bbdea557d3171c526c44d0" ON "product_platforms" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_323cecdf2ed13947ac046a841e" ON "product_platforms" ("platformId") `);
        await queryRunner.query(`ALTER TABLE "product_platforms" ADD CONSTRAINT "FK_d0b3bbdea557d3171c526c44d0f" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_platforms" ADD CONSTRAINT "FK_323cecdf2ed13947ac046a841ef" FOREIGN KEY ("platformId") REFERENCES "platform"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_platforms" DROP CONSTRAINT "FK_323cecdf2ed13947ac046a841ef"`);
        await queryRunner.query(`ALTER TABLE "product_platforms" DROP CONSTRAINT "FK_d0b3bbdea557d3171c526c44d0f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_323cecdf2ed13947ac046a841e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d0b3bbdea557d3171c526c44d0"`);
        await queryRunner.query(`DROP TABLE "product_platforms"`);
        await queryRunner.query(`DROP TABLE "platform"`);
    }

}
