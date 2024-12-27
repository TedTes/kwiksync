import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1735322269712 implements MigrationInterface {
  name = "InitialSchema1735322269712";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "merchant" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_546608b3c7bf7c175d3780c38f8" UNIQUE ("email"), CONSTRAINT "PK_9a3850e0537d869734fc9bff5d6" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" SERIAL NOT NULL, "merchantId" integer NOT NULL, "name" character varying NOT NULL, "description" character varying, "quantity" integer NOT NULL DEFAULT '0', "restockThreshold" integer NOT NULL DEFAULT '10', "restockAmount" integer, "supplierId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "supplier" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c40cbff7400f06ae1c8d9f42333" UNIQUE ("email"), CONSTRAINT "PK_2bc0d2cab6276144d2ff98a2828" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "supplier_product" ("id" SERIAL NOT NULL, "supplierId" integer, "productId" integer, CONSTRAINT "PK_18c14b1d767aaa922805766e1d7" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "trending_product" ("id" SERIAL NOT NULL, "productId" integer NOT NULL, "merchantId" character varying NOT NULL, "likes" integer NOT NULL DEFAULT '0', "shares" integer NOT NULL DEFAULT '0', "views" integer NOT NULL DEFAULT '0', "trendScore" integer, "isTrending" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4447a15c847f9aa9bae93788680" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "notification" ("id" SERIAL NOT NULL, "merchantId" character varying NOT NULL, "message" character varying NOT NULL, "read" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "login_links" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "token" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "used" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_e382a2113315c6bb8992cf97e31" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_62fcc319202f6ec1f6819e1d5f5" FOREIGN KEY ("merchantId") REFERENCES "merchant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_4346e4adb741e80f3711ee09ba4" FOREIGN KEY ("supplierId") REFERENCES "supplier"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "supplier_product" ADD CONSTRAINT "FK_317f99b34efa6ed3c3cd597d6d4" FOREIGN KEY ("supplierId") REFERENCES "supplier"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "supplier_product" ADD CONSTRAINT "FK_6e70834f3ad39bbd22a920accda" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "trending_product" ADD CONSTRAINT "FK_822e0342ac328a82d52c64f6a65" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "trending_product" DROP CONSTRAINT "FK_822e0342ac328a82d52c64f6a65"`
    );
    await queryRunner.query(
      `ALTER TABLE "supplier_product" DROP CONSTRAINT "FK_6e70834f3ad39bbd22a920accda"`
    );
    await queryRunner.query(
      `ALTER TABLE "supplier_product" DROP CONSTRAINT "FK_317f99b34efa6ed3c3cd597d6d4"`
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_4346e4adb741e80f3711ee09ba4"`
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_62fcc319202f6ec1f6819e1d5f5"`
    );
    await queryRunner.query(`DROP TABLE "login_links"`);
    await queryRunner.query(`DROP TABLE "notification"`);
    await queryRunner.query(`DROP TABLE "trending_product"`);
    await queryRunner.query(`DROP TABLE "supplier_product"`);
    await queryRunner.query(`DROP TABLE "supplier"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TABLE "merchant"`);
  }
}
