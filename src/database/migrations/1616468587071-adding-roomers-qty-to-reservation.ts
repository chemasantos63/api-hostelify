import {MigrationInterface, QueryRunner} from "typeorm";

export class addingRoomersQtyToReservation1616468587071 implements MigrationInterface {
    name = 'addingRoomersQtyToReservation1616468587071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" ADD "roomersQty" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "roomersQty"`);
    }

}
