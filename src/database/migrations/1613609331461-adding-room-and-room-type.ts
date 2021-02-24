import { MigrationInterface, QueryRunner } from 'typeorm';

export class addingRoomAndRoomType1613609331461 implements MigrationInterface {
  name = 'addingRoomAndRoomType1613609331461';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "room_types" ("id" SERIAL NOT NULL, "type" character varying(15) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_dea51158e6e5dcd28f63c295b80" UNIQUE ("type"), CONSTRAINT "PK_b6e1d0a9b67d4b9fbff9c35ab69" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rooms" ("id" SERIAL NOT NULL, "roomNumber" integer NOT NULL, "location" character varying(60), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type_id" integer NOT NULL, CONSTRAINT "UQ_e38efca75345af077ed83d53b6f" UNIQUE ("roomNumber"), CONSTRAINT "REL_fe78af61c0fab5d8c38b7ce397" UNIQUE ("type_id"), CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" ADD CONSTRAINT "FK_fe78af61c0fab5d8c38b7ce397a" FOREIGN KEY ("type_id") REFERENCES "room_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rooms" DROP CONSTRAINT "FK_fe78af61c0fab5d8c38b7ce397a"`,
    );
    await queryRunner.query(`DROP TABLE "rooms"`);
    await queryRunner.query(`DROP TABLE "room_types"`);
  }
}
