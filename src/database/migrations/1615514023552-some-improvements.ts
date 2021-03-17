import { MigrationInterface, QueryRunner } from 'typeorm';

export class someImprovements1615514023552 implements MigrationInterface {
  name = 'someImprovements1615514023552';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rooms" DROP CONSTRAINT "FK_c2d532ef188a71429c125cdc83c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" ALTER COLUMN "typeId" SET NOT NULL`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "rooms"."typeId" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "rooms" ADD CONSTRAINT "FK_c2d532ef188a71429c125cdc83c" FOREIGN KEY ("typeId") REFERENCES "room_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rooms" DROP CONSTRAINT "FK_c2d532ef188a71429c125cdc83c"`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "rooms"."typeId" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "rooms" ALTER COLUMN "typeId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" ADD CONSTRAINT "FK_c2d532ef188a71429c125cdc83c" FOREIGN KEY ("typeId") REFERENCES "room_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
