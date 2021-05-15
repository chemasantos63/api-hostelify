import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeUserCheckoutNullable1619230245342
  implements MigrationInterface {
  name = 'changeUserCheckoutNullable1619230245342';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permanences" DROP CONSTRAINT "FK_a57ad2b5a98ba1f4d2884328e55"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permanences" ALTER COLUMN "userCheckOut_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "permanences"."userCheckOut_id" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "permanences" ADD CONSTRAINT "FK_a57ad2b5a98ba1f4d2884328e55" FOREIGN KEY ("userCheckOut_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permanences" DROP CONSTRAINT "FK_a57ad2b5a98ba1f4d2884328e55"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "permanences"."userCheckOut_id" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "permanences" ALTER COLUMN "userCheckOut_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "permanences" ADD CONSTRAINT "FK_a57ad2b5a98ba1f4d2884328e55" FOREIGN KEY ("userCheckOut_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
