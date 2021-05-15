import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeVarcharLength1619288531995 implements MigrationInterface {
  name = 'changeVarcharLength1619288531995';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "guest" DROP COLUMN "origin"`);
    await queryRunner.query(
      `ALTER TABLE "guest" ADD "origin" character varying(80) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "guest" DROP COLUMN "destination"`);
    await queryRunner.query(
      `ALTER TABLE "guest" ADD "destination" character varying(80) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "guest" DROP COLUMN "occupation"`);
    await queryRunner.query(
      `ALTER TABLE "guest" ADD "occupation" character varying(80)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "guest" DROP COLUMN "occupation"`);
    await queryRunner.query(
      `ALTER TABLE "guest" ADD "occupation" character varying(20)`,
    );
    await queryRunner.query(`ALTER TABLE "guest" DROP COLUMN "destination"`);
    await queryRunner.query(
      `ALTER TABLE "guest" ADD "destination" character varying(20) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "guest" DROP COLUMN "origin"`);
    await queryRunner.query(
      `ALTER TABLE "guest" ADD "origin" character varying(20) NOT NULL`,
    );
  }
}
