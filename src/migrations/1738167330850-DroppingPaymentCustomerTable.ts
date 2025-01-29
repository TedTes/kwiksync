import { MigrationInterface, QueryRunner } from "typeorm";

export class DroppingPaymentCustomerTable1738167330850 implements MigrationInterface {
    name = 'DroppingPaymentCustomerTable1738167330850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP CONSTRAINT "FK_2a748ec33bded66497e6de18588"`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" DROP COLUMN "provider"`);
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP COLUMN "paymentCustomerId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD "paymentCustomerId" uuid`);
        await queryRunner.query(`ALTER TABLE "merchant_subscription" ADD "provider" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD CONSTRAINT "FK_2a748ec33bded66497e6de18588" FOREIGN KEY ("paymentCustomerId") REFERENCES "payment_customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
