import {MigrationInterface, QueryRunner} from "typeorm";

export class addingIdentificationFieldToGuest1618611100559 implements MigrationInterface {
    name = 'addingIdentificationFieldToGuest1618611100559'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "guest" ADD "identification" character varying(40) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "guest" ADD CONSTRAINT "UQ_2896d31c0579e66fac387d4b25f" UNIQUE ("identification")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "guest" DROP CONSTRAINT "UQ_2896d31c0579e66fac387d4b25f"`);
        await queryRunner.query(`ALTER TABLE "guest" DROP COLUMN "identification"`);
    }

}
