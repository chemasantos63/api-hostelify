import { MigrationInterface, QueryRunner } from 'typeorm';

export class addingPaymentMethodTable1620824102303
  implements MigrationInterface {
  name = 'addingPaymentMethodTable1620824102303';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "payment_methods" ("id" SERIAL NOT NULL, "description" character varying(60) NOT NULL DEFAULT 'active', "exchangeRate" numeric NOT NULL DEFAULT '1', "symbol" character varying(4) NOT NULL DEFAULT 'active', "status" character varying NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_34f9b8c6dfb4ac3559f7e2820d1" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "payment_methods"`);
  }
}
