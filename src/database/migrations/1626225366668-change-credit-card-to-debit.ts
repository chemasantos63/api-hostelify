import {MigrationInterface, QueryRunner} from "typeorm";

export class changeCreditCardToDebit1626225366668 implements MigrationInterface {
    name = 'changeCreditCardToDebit1626225366668'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "balances" RENAME COLUMN "cardTotal" TO "debitTotal"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "balances" RENAME COLUMN "debitTotal" TO "cardTotal"`);
    }

}
