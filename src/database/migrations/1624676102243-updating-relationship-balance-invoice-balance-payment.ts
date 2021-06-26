import {MigrationInterface, QueryRunner} from "typeorm";

export class updatingRelationshipBalanceInvoiceBalancePayment1624676102243 implements MigrationInterface {
    name = 'updatingRelationshipBalanceInvoiceBalancePayment1624676102243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_fff1bf37dc590b3996ca78f2db2"`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "balance_id" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "payment"."balance_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_f47e37520f3d6228fabf6f4c083"`);
        await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "balance_id" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "invoices"."balance_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_fff1bf37dc590b3996ca78f2db2" FOREIGN KEY ("balance_id") REFERENCES "balances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_f47e37520f3d6228fabf6f4c083" FOREIGN KEY ("balance_id") REFERENCES "balances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_f47e37520f3d6228fabf6f4c083"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_fff1bf37dc590b3996ca78f2db2"`);
        await queryRunner.query(`COMMENT ON COLUMN "invoices"."balance_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "balance_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_f47e37520f3d6228fabf6f4c083" FOREIGN KEY ("balance_id") REFERENCES "balances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`COMMENT ON COLUMN "payment"."balance_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "balance_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_fff1bf37dc590b3996ca78f2db2" FOREIGN KEY ("balance_id") REFERENCES "balances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
