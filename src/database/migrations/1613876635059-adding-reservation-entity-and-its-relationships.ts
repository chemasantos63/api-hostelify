import { MigrationInterface, QueryRunner } from 'typeorm';

export class addingReservationEntityAndItsRelationships1613876635059
  implements MigrationInterface {
  name = 'addingReservationEntityAndItsRelationships1613876635059';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reservations" ("id" SERIAL NOT NULL, "from" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "customer_id" integer NOT NULL, CONSTRAINT "UQ_97fe06e36dd45d468d0d08f9d4d" UNIQUE ("from"), CONSTRAINT "REL_f63cb79a34cdf2d47ab23f31a8" UNIQUE ("customer_id"), CONSTRAINT "PK_da95cef71b617ac35dc5bcda243" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reservation_rooms" ("reservationsId" integer NOT NULL, "roomsId" integer NOT NULL, CONSTRAINT "PK_22cb6c4cbca0dbfe7dd1c33c0d4" PRIMARY KEY ("reservationsId", "roomsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_525efece05ce45b726d02a38fa" ON "reservation_rooms" ("reservationsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2136509d4fbeacfed231af0b4f" ON "reservation_rooms" ("roomsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" ADD CONSTRAINT "FK_f63cb79a34cdf2d47ab23f31a8b" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservation_rooms" ADD CONSTRAINT "FK_525efece05ce45b726d02a38fa1" FOREIGN KEY ("reservationsId") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservation_rooms" ADD CONSTRAINT "FK_2136509d4fbeacfed231af0b4f4" FOREIGN KEY ("roomsId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reservation_rooms" DROP CONSTRAINT "FK_2136509d4fbeacfed231af0b4f4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservation_rooms" DROP CONSTRAINT "FK_525efece05ce45b726d02a38fa1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" DROP CONSTRAINT "FK_f63cb79a34cdf2d47ab23f31a8b"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_2136509d4fbeacfed231af0b4f"`);
    await queryRunner.query(`DROP INDEX "IDX_525efece05ce45b726d02a38fa"`);
    await queryRunner.query(`DROP TABLE "reservation_rooms"`);
    await queryRunner.query(`DROP TABLE "reservations"`);
  }
}
