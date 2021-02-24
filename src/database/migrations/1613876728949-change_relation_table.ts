import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeRelationTable1613876728949 implements MigrationInterface {
  name = 'changeRelationTable1613876728949';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reservations_rooms" ("reservationsId" integer NOT NULL, "roomsId" integer NOT NULL, CONSTRAINT "PK_4ec304de21399c6277285834344" PRIMARY KEY ("reservationsId", "roomsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_312f8b16e47c6724f0d23bb4a1" ON "reservations_rooms" ("reservationsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4624fe521a3369161e23a788c1" ON "reservations_rooms" ("roomsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations_rooms" ADD CONSTRAINT "FK_312f8b16e47c6724f0d23bb4a12" FOREIGN KEY ("reservationsId") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations_rooms" ADD CONSTRAINT "FK_4624fe521a3369161e23a788c1c" FOREIGN KEY ("roomsId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reservations_rooms" DROP CONSTRAINT "FK_4624fe521a3369161e23a788c1c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations_rooms" DROP CONSTRAINT "FK_312f8b16e47c6724f0d23bb4a12"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_4624fe521a3369161e23a788c1"`);
    await queryRunner.query(`DROP INDEX "IDX_312f8b16e47c6724f0d23bb4a1"`);
    await queryRunner.query(`DROP TABLE "reservations_rooms"`);
  }
}
