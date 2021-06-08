import {MigrationInterface, QueryRunner} from "typeorm";

export class addingRelationBetweenBillingAndInvoiceReport1623167484685 implements MigrationInterface {
    name = 'addingRelationBetweenBillingAndInvoiceReport1623167484685'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices_report_detail" ADD "invoiceId" integer`);
        await queryRunner.query(`ALTER TABLE "invoices_report_detail_payments" ADD "invoiceId" integer`);
        await queryRunner.query(`ALTER TABLE "invoices_report_detail" ADD CONSTRAINT "FK_7cdfe85218978fff94b4ea20d01" FOREIGN KEY ("invoiceId") REFERENCES "invoices_report"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoices_report_detail_payments" ADD CONSTRAINT "FK_119ec46fe499ffc69325e6ec6ef" FOREIGN KEY ("invoiceId") REFERENCES "invoices_report"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices_report_detail_payments" DROP CONSTRAINT "FK_119ec46fe499ffc69325e6ec6ef"`);
        await queryRunner.query(`ALTER TABLE "invoices_report_detail" DROP CONSTRAINT "FK_7cdfe85218978fff94b4ea20d01"`);
        await queryRunner.query(`ALTER TABLE "invoices_report_detail_payments" DROP COLUMN "invoiceId"`);
        await queryRunner.query(`ALTER TABLE "invoices_report_detail" DROP COLUMN "invoiceId"`);
    }

}
