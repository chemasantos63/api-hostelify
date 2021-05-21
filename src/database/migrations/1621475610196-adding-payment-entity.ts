import { MigrationInterface, QueryRunner } from 'typeorm';

export class addingPaymentEntity1621475610196 implements MigrationInterface {
  name = 'addingPaymentEntity1621475610196';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "payment" ("id" SERIAL NOT NULL, "amount" numeric NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "payment_method_id" integer NOT NULL, CONSTRAINT "REL_365af7f69f9142427cf30395b0" UNIQUE ("payment_method_id"), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "payment_methods"."symbol" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_methods" ALTER COLUMN "symbol" DROP DEFAULT`,
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
      `ALTER TABLE "payment_methods" ALTER COLUMN "symbol" SET DEFAULT 'active'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "payment_methods"."symbol" IS NULL`,
    );
    await queryRunner.query(`DROP TABLE "payment"`);
  }
}
