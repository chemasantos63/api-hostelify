import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeReservationToDateToNullableTrue1626999657793
  implements MigrationInterface {
  name = 'changeReservationToDateToNullableTrue1626999657793';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reservations" ALTER COLUMN "toDate" DROP NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "reservations"."toDate" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "reservations"."toDate" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" ALTER COLUMN "toDate" SET NOT NULL`,
    );
  }
}
