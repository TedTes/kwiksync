import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePlanAndSubscriptionTable1737988817768 implements MigrationInterface {
    name = 'CreatePlanAndSubscriptionTable1737988817768'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "plan" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "monthlyPrice" numeric NOT NULL, "annualPrice" numeric NOT NULL, "features" text NOT NULL, "isActive" boolean NOT NULL, CONSTRAINT "PK_54a2b686aed3b637654bf7ddbb3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "merchant_subscription" ("id" SERIAL NOT NULL, "startDate" TIMESTAMP NOT NULL, "billingCycle" character varying NOT NULL, "merchantId" integer, "planId" integer, CONSTRAINT "PK_6c92cb16e3b33e6f38222bbe0c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" ADD CONSTRAINT "FK_eab9abe876ec06f223a9cf5b72c" FOREIGN KEY ("merchantId") REFERENCES "merchant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" ADD CONSTRAINT "FK_e12a3f31e78e73debfa76ee20f8" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merchant_subscription" DROP CONSTRAINT "FK_e12a3f31e78e73debfa76ee20f8"`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" DROP CONSTRAINT "FK_eab9abe876ec06f223a9cf5b72c"`);
        await queryRunner.query(`DROP TABLE "merchant_subscription"`);
        await queryRunner.query(`DROP TABLE "plan"`);
    }

}
