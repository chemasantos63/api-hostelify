import { MigrationInterface, QueryRunner } from 'typeorm';

export class addingInvoiceReportTableWithItsDetail1622687490358
  implements MigrationInterface {
  name = 'addingInvoiceReportTableWithItsDetail1622687490358';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "invoices_report" ("id" SERIAL NOT NULL, "customerCode" character varying, "customerIdentification" character varying, "customerName" character varying, "invoiceCai" character varying, "invoiceCondition" character varying, "invoiceDateAndTime" character varying, "invoiceNumber" character varying, "invoiceSubtotal" character varying, "invoiceTaxableAmount15" character varying, "invoiceTaxAmount15" character varying, "invoiceTaxableAmount18" character varying, "invoiceTaxAmount18" character varying, "invoiceTaxAmount4" character varying, "invoiceExentAmount" character varying, "invoiceExoneratedAmount" character varying, "invoiceTotal" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_59a1075ade133d8a59f571c1394" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "invoices_report_detail" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bb44fe04827c37a04dab5f437e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "invoices"."condition" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "invoices" ALTER COLUMN "condition" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoices" ALTER COLUMN "condition" SET DEFAULT 'contado'`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "invoices"."condition" IS NULL`);
    await queryRunner.query(`DROP TABLE "invoices_report_detail"`);
    await queryRunner.query(`DROP TABLE "invoices_report"`);
  }
}
