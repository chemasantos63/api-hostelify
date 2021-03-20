import {MigrationInterface, QueryRunner} from "typeorm";

export class fixReservationUnique1616119488491 implements MigrationInterface {
    name = 'fixReservationUnique1616119488491'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "status"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" ADD "status" character varying NOT NULL DEFAULT 'active'`);
    }

}
