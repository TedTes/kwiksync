import { MigrationInterface, QueryRunner } from "typeorm";

export class RestoringDB1737057334935 implements MigrationInterface {
    name = 'RestoringDB1737057334935'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "merchant" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_546608b3c7bf7c175d3780c38f8" UNIQUE ("email"), CONSTRAINT "PK_9a3850e0537d869734fc9bff5d6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "category" character varying NOT NULL DEFAULT 'Uncategorized', "basePrice" numeric(10,2) NOT NULL, "sku" character varying NOT NULL DEFAULT '0', "metadata" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "supplier" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c40cbff7400f06ae1c8d9f42333" UNIQUE ("email"), CONSTRAINT "PK_2bc0d2cab6276144d2ff98a2828" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "supplier_product" ("id" SERIAL NOT NULL, "supplierId" integer, "productId" integer, CONSTRAINT "PK_18c14b1d767aaa922805766e1d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "trending_product" ("id" SERIAL NOT NULL, "likes" integer NOT NULL DEFAULT '0', "shares" integer NOT NULL DEFAULT '0', "views" integer NOT NULL DEFAULT '0', "revenue" numeric(10,2) NOT NULL DEFAULT '0', "unitsSold" integer NOT NULL DEFAULT '0', "trendScore" integer, "isTrending" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "productId" integer, "platformId" integer, CONSTRAINT "PK_4447a15c847f9aa9bae93788680" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying(255), "email" character varying NOT NULL, "password" character varying, "role" character varying NOT NULL DEFAULT 'merchant', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "refreshToken" text, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "lastLoginAt" TIMESTAMP, "picture" character varying(255), "googleId" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "merchantId" integer NOT NULL, "message" character varying NOT NULL, "read" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "login_links" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "token" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "used" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_e382a2113315c6bb8992cf97e31" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sales" ("id" SERIAL NOT NULL, "quantitySold" integer NOT NULL, "totalRevenue" numeric(10,2) NOT NULL, "saleDate" TIMESTAMP NOT NULL DEFAULT now(), "productId" integer, CONSTRAINT "PK_4f0bc990ae81dba46da680895ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "platform" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b9b57ec16b9c2ac927aa62b8b3f" UNIQUE ("name"), CONSTRAINT "PK_c33d6abeebd214bd2850bfd6b8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "merchant_product" ("id" SERIAL NOT NULL, "sellingPrice" numeric(10,2) NOT NULL, "stockQuantity" integer NOT NULL DEFAULT '0', "listedDate" TIMESTAMP NOT NULL DEFAULT now(), "unlistedDate" TIMESTAMP, "isActive" boolean NOT NULL DEFAULT true, "merchantId" integer, "productId" integer, CONSTRAINT "PK_18b429ac7fe9530c3056f4ec04c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_inventory" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL DEFAULT '0', "restockThreshold" integer NOT NULL DEFAULT '10', "restockAmount" integer, "location" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "productId" integer, CONSTRAINT "PK_84e9362e0a5bf063e561d9452ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_platform" ("id" SERIAL NOT NULL, "platformPrice" numeric(10,2) NOT NULL, "platformSku" character varying, "isActive" boolean NOT NULL DEFAULT true, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "listedAt" TIMESTAMP NOT NULL DEFAULT now(), "unlistedAt" TIMESTAMP, "productId" integer, "platformId" integer, CONSTRAINT "PK_8a856a4b0c824e49a347d65a0d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "supplier_product" ADD CONSTRAINT "FK_317f99b34efa6ed3c3cd597d6d4" FOREIGN KEY ("supplierId") REFERENCES "supplier"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "supplier_product" ADD CONSTRAINT "FK_6e70834f3ad39bbd22a920accda" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trending_product" ADD CONSTRAINT "FK_822e0342ac328a82d52c64f6a65" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trending_product" ADD CONSTRAINT "FK_add99ecae0b855fde3bcf9c2c54" FOREIGN KEY ("platformId") REFERENCES "platform"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sales" ADD CONSTRAINT "FK_58de77cc0543589490a33558b8e" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "merchant_product" ADD CONSTRAINT "FK_0f4ca5fff5c79a7f361374751d6" FOREIGN KEY ("merchantId") REFERENCES "merchant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "merchant_product" ADD CONSTRAINT "FK_2216fa755a8906a31c994c150b2" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_inventory" ADD CONSTRAINT "FK_3a5217b38a320b18071ab4e127c" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_platform" ADD CONSTRAINT "FK_dec7261d55b360e3c2f09fc40e1" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_platform" ADD CONSTRAINT "FK_deddfa545dfda951571f51d800f" FOREIGN KEY ("platformId") REFERENCES "platform"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_platform" DROP CONSTRAINT "FK_deddfa545dfda951571f51d800f"`);
        await queryRunner.query(`ALTER TABLE "product_platform" DROP CONSTRAINT "FK_dec7261d55b360e3c2f09fc40e1"`);
        await queryRunner.query(`ALTER TABLE "product_inventory" DROP CONSTRAINT "FK_3a5217b38a320b18071ab4e127c"`);
        await queryRunner.query(`ALTER TABLE "merchant_product" DROP CONSTRAINT "FK_2216fa755a8906a31c994c150b2"`);
        await queryRunner.query(`ALTER TABLE "merchant_product" DROP CONSTRAINT "FK_0f4ca5fff5c79a7f361374751d6"`);
        await queryRunner.query(`ALTER TABLE "sales" DROP CONSTRAINT "FK_58de77cc0543589490a33558b8e"`);
        await queryRunner.query(`ALTER TABLE "trending_product" DROP CONSTRAINT "FK_add99ecae0b855fde3bcf9c2c54"`);
        await queryRunner.query(`ALTER TABLE "trending_product" DROP CONSTRAINT "FK_822e0342ac328a82d52c64f6a65"`);
        await queryRunner.query(`ALTER TABLE "supplier_product" DROP CONSTRAINT "FK_6e70834f3ad39bbd22a920accda"`);
        await queryRunner.query(`ALTER TABLE "supplier_product" DROP CONSTRAINT "FK_317f99b34efa6ed3c3cd597d6d4"`);
        await queryRunner.query(`DROP TABLE "product_platform"`);
        await queryRunner.query(`DROP TABLE "product_inventory"`);
        await queryRunner.query(`DROP TABLE "merchant_product"`);
        await queryRunner.query(`DROP TABLE "platform"`);
        await queryRunner.query(`DROP TABLE "sales"`);
        await queryRunner.query(`DROP TABLE "login_links"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "trending_product"`);
        await queryRunner.query(`DROP TABLE "supplier_product"`);
        await queryRunner.query(`DROP TABLE "supplier"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "merchant"`);
    }

}
