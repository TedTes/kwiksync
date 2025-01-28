import { MigrationInterface, QueryRunner } from "typeorm";

export class UpadteColumnsInMerchantSubscriptionTable1738084582091 implements MigrationInterface {
    name = 'UpadteColumnsInMerchantSubscriptionTable1738084582091'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merchant_subscription" DROP CONSTRAINT "FK_eab9abe876ec06f223a9cf5b72c"`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" DROP COLUMN "startDate"`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" ADD "provider" character varying NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."merchant_subscription_status_enum" AS ENUM('active', 'inactive', 'canceled', 'pending')`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" ADD "status" "public"."merchant_subscription_status_enum" NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" ADD "currentPeriodStart" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" ADD "currentPeriodEnd" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" ADD "cancelAtPeriodEnd" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" ADD "canceledAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" ADD "paymentMetadata" jsonb`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" ADD "paymentProviderSubscriptionId" character varying`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" ADD "paymentMethodId" uuid`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" DROP COLUMN "billingCycle"`);
        await queryRunner.query(`CREATE TYPE "public"."merchant_subscription_billingcycle_enum" AS ENUM('monthly', 'annual')`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" ADD "billingCycle" "public"."merchant_subscription_billingcycle_enum" NOT NULL DEFAULT 'monthly'`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" ADD CONSTRAINT "FK_eab9abe876ec06f223a9cf5b72c" FOREIGN KEY ("merchantId") REFERENCES "merchant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" ADD CONSTRAINT "FK_b4e44723aca7f236d8fc1e59f87" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merchant_subscription" DROP CONSTRAINT "FK_b4e44723aca7f236d8fc1e59f87"`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" DROP CONSTRAINT "FK_eab9abe876ec06f223a9cf5b72c"`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" DROP COLUMN "billingCycle"`);
        await queryRunner.query(`DROP TYPE "public"."merchant_subscription_billingcycle_enum"`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" ADD "billingCycle" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" DROP COLUMN "paymentMethodId"`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" DROP COLUMN "paymentProviderSubscriptionId"`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" DROP COLUMN "paymentMetadata"`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" DROP COLUMN "canceledAt"`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" DROP COLUMN "cancelAtPeriodEnd"`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" DROP COLUMN "currentPeriodEnd"`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" DROP COLUMN "currentPeriodStart"`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."merchant_subscription_status_enum"`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" DROP COLUMN "provider"`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" ADD "startDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" ADD CONSTRAINT "FK_eab9abe876ec06f223a9cf5b72c" FOREIGN KEY ("merchantId") REFERENCES "merchant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
