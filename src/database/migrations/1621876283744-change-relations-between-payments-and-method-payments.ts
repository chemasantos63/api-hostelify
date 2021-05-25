import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeRelationsBetweenPaymentsAndMethodPayments1621876283744
  implements MigrationInterface {
  name = 'changeRelationsBetweenPaymentsAndMethodPayments1621876283744';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_365af7f69f9142427cf30395b00"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ALTER COLUMN "payment_method_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "payment"."payment_method_id" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "REL_365af7f69f9142427cf30395b0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_365af7f69f9142427cf30395b00" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_365af7f69f9142427cf30395b00"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "REL_365af7f69f9142427cf30395b0" UNIQUE ("payment_method_id")`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "payment"."payment_method_id" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ALTER COLUMN "payment_method_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_365af7f69f9142427cf30395b00" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
