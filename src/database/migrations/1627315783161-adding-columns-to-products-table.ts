import { MigrationInterface, QueryRunner } from 'typeorm';

export class addingColumnsToProductsTable1627315783161
  implements MigrationInterface {
  name = 'addingColumnsToProductsTable1627315783161';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ADD "status" character varying NOT NULL DEFAULT 'active'`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "products"."code" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "UQ_7cfc24d6c24f0ec91294003d6b8" UNIQUE ("code")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "UQ_7cfc24d6c24f0ec91294003d6b8"`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "products"."code" IS NULL`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "status"`);
  }
}
