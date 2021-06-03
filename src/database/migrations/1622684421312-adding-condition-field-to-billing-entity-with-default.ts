import { MigrationInterface, QueryRunner } from 'typeorm';

export class addingConditionFieldToBillingEntityWithDefault1622684421312
  implements MigrationInterface {
  name = 'addingConditionFieldToBillingEntityWithDefault1622684421312';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoices" ADD "condition" character varying NOT NULL DEFAULT 'contado'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoices" DROP COLUMN "condition"`);
  }
}
