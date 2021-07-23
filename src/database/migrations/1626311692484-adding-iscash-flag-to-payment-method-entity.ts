import { MigrationInterface, QueryRunner } from 'typeorm';

export class addingIscashFlagToPaymentMethodEntity1626311692484
  implements MigrationInterface {
  name = 'addingIscashFlagToPaymentMethodEntity1626311692484';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_methods" ADD "isCash" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_methods" DROP COLUMN "isCash"`,
    );
  }
}
