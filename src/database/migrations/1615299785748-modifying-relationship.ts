import { MigrationInterface, QueryRunner } from 'typeorm';

export class modifyingRelationship1615299785748 implements MigrationInterface {
  name = 'modifyingRelationship1615299785748';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "customer_types"."type" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_types" ADD CONSTRAINT "UQ_641fdf11f88e144cc1378538ba7" UNIQUE ("type")`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" DROP CONSTRAINT "FK_c3591e1038438829450dff973b7"`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "customers"."type_id" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "customers" DROP CONSTRAINT "REL_c3591e1038438829450dff973b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD CONSTRAINT "FK_c3591e1038438829450dff973b7" FOREIGN KEY ("type_id") REFERENCES "customer_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" DROP CONSTRAINT "FK_c3591e1038438829450dff973b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD CONSTRAINT "REL_c3591e1038438829450dff973b" UNIQUE ("type_id")`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "customers"."type_id" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "customers" ADD CONSTRAINT "FK_c3591e1038438829450dff973b7" FOREIGN KEY ("type_id") REFERENCES "customer_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_types" DROP CONSTRAINT "UQ_641fdf11f88e144cc1378538ba7"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "customer_types"."type" IS NULL`,
    );
  }
}
