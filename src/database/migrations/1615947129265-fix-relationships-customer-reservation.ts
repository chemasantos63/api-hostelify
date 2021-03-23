import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixRelationshipsCustomerReservation1615947129265
  implements MigrationInterface {
  name = 'fixRelationshipsCustomerReservation1615947129265';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reservations" DROP CONSTRAINT "FK_f63cb79a34cdf2d47ab23f31a8b"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "reservations"."customer_id" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" DROP CONSTRAINT "REL_f63cb79a34cdf2d47ab23f31a8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" ADD CONSTRAINT "FK_f63cb79a34cdf2d47ab23f31a8b" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reservations" DROP CONSTRAINT "FK_f63cb79a34cdf2d47ab23f31a8b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" ADD CONSTRAINT "REL_f63cb79a34cdf2d47ab23f31a8" UNIQUE ("customer_id")`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "reservations"."customer_id" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" ADD CONSTRAINT "FK_f63cb79a34cdf2d47ab23f31a8b" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
