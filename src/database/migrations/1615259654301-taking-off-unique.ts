import { MigrationInterface, QueryRunner } from 'typeorm';

export class takingOffUnique1615259654301 implements MigrationInterface {
  name = 'takingOffUnique1615259654301';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "customer_types"."type" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_types" DROP CONSTRAINT "UQ_641fdf11f88e144cc1378538ba7"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customer_types" ADD CONSTRAINT "UQ_641fdf11f88e144cc1378538ba7" UNIQUE ("type")`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "customer_types"."type" IS NULL`,
    );
  }
}
