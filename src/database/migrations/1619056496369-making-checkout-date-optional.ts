import { MigrationInterface, QueryRunner } from 'typeorm';

export class makingCheckoutDateOptional1619056496369
  implements MigrationInterface {
  name = 'makingCheckoutDateOptional1619056496369';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permanences" ALTER COLUMN "checkOut" DROP NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "permanences"."checkOut" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "permanences"."checkOut" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "permanences" ALTER COLUMN "checkOut" SET NOT NULL`,
    );
  }
}
