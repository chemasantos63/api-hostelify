import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixingRelationRoom1613610084843 implements MigrationInterface {
  name = 'fixingRelationRoom1613610084843';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rooms" DROP CONSTRAINT "FK_fe78af61c0fab5d8c38b7ce397a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" DROP CONSTRAINT "REL_fe78af61c0fab5d8c38b7ce397"`,
    );
    await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "type_id"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rooms" ADD "type_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" ADD CONSTRAINT "REL_fe78af61c0fab5d8c38b7ce397" UNIQUE ("type_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" ADD CONSTRAINT "FK_fe78af61c0fab5d8c38b7ce397a" FOREIGN KEY ("type_id") REFERENCES "room_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
