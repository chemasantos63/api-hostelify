import {MigrationInterface, QueryRunner} from "typeorm";

export class addingFieldsToFiscalInformationTable1621568192721 implements MigrationInterface {
    name = 'addingFieldsToFiscalInformationTable1621568192721'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fiscal_informations" DROP COLUMN "dateFrom"`);
        await queryRunner.query(`ALTER TABLE "fiscal_informations" DROP COLUMN "dateTo"`);
        await queryRunner.query(`ALTER TABLE "fiscal_informations" ADD "dateValidFrom" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "fiscal_informations" ADD "dateValidTo" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "fiscal_informations" ADD "currentNumber" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "fiscal_informations" ADD "range" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fiscal_informations" DROP COLUMN "range"`);
        await queryRunner.query(`ALTER TABLE "fiscal_informations" DROP COLUMN "currentNumber"`);
        await queryRunner.query(`ALTER TABLE "fiscal_informations" DROP COLUMN "dateValidTo"`);
        await queryRunner.query(`ALTER TABLE "fiscal_informations" DROP COLUMN "dateValidFrom"`);
        await queryRunner.query(`ALTER TABLE "fiscal_informations" ADD "dateTo" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "fiscal_informations" ADD "dateFrom" date NOT NULL`);
    }

}
