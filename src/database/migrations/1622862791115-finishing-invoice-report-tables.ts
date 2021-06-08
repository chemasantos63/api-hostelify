import {MigrationInterface, QueryRunner} from "typeorm";

export class finishingInvoiceReportTables1622862791115 implements MigrationInterface {
    name = 'finishingInvoiceReportTables1622862791115'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "invoices_report_detail_payments" ("id" SERIAL NOT NULL, "paymentDescription" character varying NOT NULL, "paymentAmount" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7737c311f677e63f76a0dafbda7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "invoices_report" ADD "fiscalInformationDateValidTo" character varying`);
        await queryRunner.query(`ALTER TABLE "invoices_report" ADD "fiscalInformationRange" character varying`);
        await queryRunner.query(`ALTER TABLE "invoices_report" ADD "totalWrittenValue" character varying`);
        await queryRunner.query(`ALTER TABLE "invoices_report_detail" ADD "quantity" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoices_report_detail" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoices_report_detail" ADD "roomersQuantity" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoices_report_detail" ADD "unitPrice" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoices_report_detail" ADD "discount" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoices_report_detail" ADD "total" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices_report_detail" DROP COLUMN "total"`);
        await queryRunner.query(`ALTER TABLE "invoices_report_detail" DROP COLUMN "discount"`);
        await queryRunner.query(`ALTER TABLE "invoices_report_detail" DROP COLUMN "unitPrice"`);
        await queryRunner.query(`ALTER TABLE "invoices_report_detail" DROP COLUMN "roomersQuantity"`);
        await queryRunner.query(`ALTER TABLE "invoices_report_detail" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "invoices_report_detail" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "invoices_report" DROP COLUMN "totalWrittenValue"`);
        await queryRunner.query(`ALTER TABLE "invoices_report" DROP COLUMN "fiscalInformationRange"`);
        await queryRunner.query(`ALTER TABLE "invoices_report" DROP COLUMN "fiscalInformationDateValidTo"`);
        await queryRunner.query(`DROP TABLE "invoices_report_detail_payments"`);
    }

}
