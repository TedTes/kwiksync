import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePaymentMethodTable1738084205588 implements MigrationInterface {
    name = 'CreatePaymentMethodTable1738084205588'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment_methods" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "methodType" character varying NOT NULL, "provider" character varying NOT NULL, "lastFourDigits" character varying NOT NULL, "expiryDate" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "paymentCustomerId" uuid, CONSTRAINT "PK_34f9b8c6dfb4ac3559f7e2820d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "plan" ALTER COLUMN "monthlyPriceInCents" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "plan" ALTER COLUMN "annualPriceInCents" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD CONSTRAINT "FK_2a748ec33bded66497e6de18588" FOREIGN KEY ("paymentCustomerId") REFERENCES "payment_customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP CONSTRAINT "FK_2a748ec33bded66497e6de18588"`);
        await queryRunner.query(`ALTER TABLE "plan" ALTER COLUMN "annualPriceInCents" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "plan" ALTER COLUMN "monthlyPriceInCents" SET DEFAULT '0'`);
        await queryRunner.query(`DROP TABLE "payment_methods"`);
    }

}
