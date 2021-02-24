import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixUserDetails1612298953164 implements MigrationInterface {
  name = 'fixUserDetails1612298953164';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_details" ALTER COLUMN "name" DROP NOT NULL`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "user_details"."name" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "user_details" ALTER COLUMN "created_at" DROP NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user_details"."created_at" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_details" ALTER COLUMN "updated_at" DROP NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user_details"."updated_at" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "user_details"."updated_at" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_details" ALTER COLUMN "updated_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user_details"."created_at" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_details" ALTER COLUMN "created_at" SET NOT NULL`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "user_details"."name" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "user_details" ALTER COLUMN "name" SET NOT NULL`,
    );
  }
}
