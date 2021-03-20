import {MigrationInterface, QueryRunner} from "typeorm";

export class fixReservationUnique21616119529261 implements MigrationInterface {
    name = 'fixReservationUnique21616119529261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" ADD "status" character varying NOT NULL DEFAULT 'active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "status"`);
    }

}
