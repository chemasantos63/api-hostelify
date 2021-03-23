import {MigrationInterface, QueryRunner} from "typeorm";

export class addingRoomStatusTable1616463272891 implements MigrationInterface {
    name = 'addingRoomStatusTable1616463272891'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" RENAME COLUMN "status" TO "statusId"`);
        await queryRunner.query(`CREATE TABLE "room_status" ("id" SERIAL NOT NULL, "description" character varying(15) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_02d758e44ac301e066afb1b2365" UNIQUE ("description"), CONSTRAINT "PK_39a39d2b2147e6aa7f080725826" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "statusId"`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "statusId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_e89f1ab116d3937027b271aabf0" FOREIGN KEY ("statusId") REFERENCES "room_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_e89f1ab116d3937027b271aabf0"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "statusId"`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "statusId" character varying NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`DROP TABLE "room_status"`);
        await queryRunner.query(`ALTER TABLE "rooms" RENAME COLUMN "statusId" TO "status"`);
    }

}
