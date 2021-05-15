import { MigrationInterface, QueryRunner } from 'typeorm';

export class addingGuestManyToManyRelationToReservation1619280254359
  implements MigrationInterface {
  name = 'addingGuestManyToManyRelationToReservation1619280254359';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reservations_guest" ("reservationsId" integer NOT NULL, "guestId" integer NOT NULL, CONSTRAINT "PK_cba84b536c894ca500c5d992190" PRIMARY KEY ("reservationsId", "guestId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c3567a894a64c4f388105e5b92" ON "reservations_guest" ("reservationsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_74875ffd7126e72c684e359236" ON "reservations_guest" ("guestId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations_guest" ADD CONSTRAINT "FK_c3567a894a64c4f388105e5b92b" FOREIGN KEY ("reservationsId") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations_guest" ADD CONSTRAINT "FK_74875ffd7126e72c684e3592369" FOREIGN KEY ("guestId") REFERENCES "guest"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reservations_guest" DROP CONSTRAINT "FK_74875ffd7126e72c684e3592369"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations_guest" DROP CONSTRAINT "FK_c3567a894a64c4f388105e5b92b"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_74875ffd7126e72c684e359236"`);
    await queryRunner.query(`DROP INDEX "IDX_c3567a894a64c4f388105e5b92"`);
    await queryRunner.query(`DROP TABLE "reservations_guest"`);
  }
}
