import { MigrationInterface, QueryRunner } from 'typeorm';

export class addingCustomerStatusField1615300979281
  implements MigrationInterface {
  name = 'addingCustomerStatusField1615300979281';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "status" character varying NOT NULL DEFAULT 'active'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "status"`);
  }
}
