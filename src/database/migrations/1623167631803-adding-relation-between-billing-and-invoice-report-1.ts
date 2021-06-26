import { MigrationInterface, QueryRunner } from 'typeorm';

export class addingRelationBetweenBillingAndInvoiceReport11623167631803
  implements MigrationInterface {
  name = 'addingRelationBetweenBillingAndInvoiceReport11623167631803';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoices" ADD "invoice_report_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" ADD CONSTRAINT "UQ_7030c958bca8a52f6d29fc8182b" UNIQUE ("invoice_report_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" ADD CONSTRAINT "FK_7030c958bca8a52f6d29fc8182b" FOREIGN KEY ("invoice_report_id") REFERENCES "invoices_report"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoices" DROP CONSTRAINT "FK_7030c958bca8a52f6d29fc8182b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" DROP CONSTRAINT "UQ_7030c958bca8a52f6d29fc8182b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" DROP COLUMN "invoice_report_id"`,
    );
  }
}
