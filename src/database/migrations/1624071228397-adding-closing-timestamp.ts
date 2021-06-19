import {MigrationInterface, QueryRunner} from "typeorm";

export class addingClosingTimestamp1624071228397 implements MigrationInterface {
    name = 'addingClosingTimestamp1624071228397'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "balances" ADD "closingDate" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "balances" DROP COLUMN "closingDate"`);
    }

}
