import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixingRelationRoomAgain1613610529700
  implements MigrationInterface {
  name = 'fixingRelationRoomAgain1613610529700';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "rooms" ADD "typeId" integer`);
    await queryRunner.query(
      `ALTER TABLE "rooms" ADD CONSTRAINT "FK_c2d532ef188a71429c125cdc83c" FOREIGN KEY ("typeId") REFERENCES "room_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rooms" DROP CONSTRAINT "FK_c2d532ef188a71429c125cdc83c"`,
    );
    await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "typeId"`);
  }
}
