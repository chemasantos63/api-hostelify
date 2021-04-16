import {MigrationInterface, QueryRunner} from "typeorm";

export class addingPermanenceAndGuestTables1618543498828 implements MigrationInterface {
    name = 'addingPermanenceAndGuestTables1618543498828'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "guest" ("id" SERIAL NOT NULL, "name" character varying(60) NOT NULL, "lastname" character varying(60) NOT NULL, "nationality" character varying(20) NOT NULL, "origin" character varying(20) NOT NULL, "destination" character varying(20) NOT NULL, "occupation" character varying(20), "phone" character varying(20) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_57689d19445de01737dbc458857" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permanences" ("id" SERIAL NOT NULL, "checkIn" TIMESTAMP NOT NULL, "checkOut" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "customer_id" integer NOT NULL, "reservation_id" integer NOT NULL, "userCheckIn_id" integer NOT NULL, "userCheckOut_id" integer NOT NULL, CONSTRAINT "REL_3dbda17e1a8848262ad89a8c91" UNIQUE ("reservation_id"), CONSTRAINT "PK_bc952aadb50128e3f2051cd01dd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permanences_guest" ("permanencesId" integer NOT NULL, "guestId" integer NOT NULL, CONSTRAINT "PK_7361e52491f28091e9538dfd4ad" PRIMARY KEY ("permanencesId", "guestId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5dee52224f6215812829a455a6" ON "permanences_guest" ("permanencesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c4537a04ae3104201bad7c6cfa" ON "permanences_guest" ("guestId") `);
        await queryRunner.query(`ALTER TABLE "permanences" ADD CONSTRAINT "FK_cad32d9048d0fc575f11112930d" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permanences" ADD CONSTRAINT "FK_3dbda17e1a8848262ad89a8c91e" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permanences" ADD CONSTRAINT "FK_7870f49d6d2fccdadbdf167ded7" FOREIGN KEY ("userCheckIn_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permanences" ADD CONSTRAINT "FK_a57ad2b5a98ba1f4d2884328e55" FOREIGN KEY ("userCheckOut_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permanences_guest" ADD CONSTRAINT "FK_5dee52224f6215812829a455a65" FOREIGN KEY ("permanencesId") REFERENCES "permanences"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permanences_guest" ADD CONSTRAINT "FK_c4537a04ae3104201bad7c6cfa0" FOREIGN KEY ("guestId") REFERENCES "guest"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permanences_guest" DROP CONSTRAINT "FK_c4537a04ae3104201bad7c6cfa0"`);
        await queryRunner.query(`ALTER TABLE "permanences_guest" DROP CONSTRAINT "FK_5dee52224f6215812829a455a65"`);
        await queryRunner.query(`ALTER TABLE "permanences" DROP CONSTRAINT "FK_a57ad2b5a98ba1f4d2884328e55"`);
        await queryRunner.query(`ALTER TABLE "permanences" DROP CONSTRAINT "FK_7870f49d6d2fccdadbdf167ded7"`);
        await queryRunner.query(`ALTER TABLE "permanences" DROP CONSTRAINT "FK_3dbda17e1a8848262ad89a8c91e"`);
        await queryRunner.query(`ALTER TABLE "permanences" DROP CONSTRAINT "FK_cad32d9048d0fc575f11112930d"`);
        await queryRunner.query(`DROP INDEX "IDX_c4537a04ae3104201bad7c6cfa"`);
        await queryRunner.query(`DROP INDEX "IDX_5dee52224f6215812829a455a6"`);
        await queryRunner.query(`DROP TABLE "permanences_guest"`);
        await queryRunner.query(`DROP TABLE "permanences"`);
        await queryRunner.query(`DROP TABLE "guest"`);
    }

}
