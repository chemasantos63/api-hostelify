import { MigrationInterface, QueryRunner } from 'typeorm';

export class addingAllInvoiceDatabaseStructure1621566424856
  implements MigrationInterface {
  name = 'addingAllInvoiceDatabaseStructure1621566424856';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "fiscal_informations" ("id" SERIAL NOT NULL, "prefix" character varying NOT NULL, "begin" integer NOT NULL, "end" integer NOT NULL, "dateFrom" date NOT NULL, "dateTo" date NOT NULL, "cai" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2b4eea57b13e1c8c658b469b6e6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "invoice_totals" ("id" SERIAL NOT NULL, "subtotal" numeric NOT NULL DEFAULT '0', "taxedAmount" numeric NOT NULL DEFAULT '0', "tax15Amount" numeric NOT NULL DEFAULT '0', "tax18Amount" numeric NOT NULL DEFAULT '0', "tourismTax" numeric NOT NULL DEFAULT '0', "exemptAmount" numeric NOT NULL DEFAULT '0', "total" numeric NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_512e1b2627cacf5c5092e965277" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "invoices" ("id" SERIAL NOT NULL, "cai" character varying NOT NULL, "invoiceNumber" integer NOT NULL, "status" character varying NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "total_id" integer NOT NULL, "fiscalInformation_id" integer NOT NULL, CONSTRAINT "REL_dfb3de7a7f6c9876554b224fd7" UNIQUE ("total_id"), CONSTRAINT "REL_f22f7faee0fcfbad7c764b4925" UNIQUE ("fiscalInformation_id"), CONSTRAINT "PK_668cef7c22a427fd822cc1be3ce" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "payment" ADD "invoiceId" integer`);
    await queryRunner.query(
      `ALTER TABLE "permanences" ADD "invoiceId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_87223c7f1d4c2ca51cf69927844" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "permanences" ADD CONSTRAINT "FK_cfaa8584f7f7fe6be09127d6561" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" ADD CONSTRAINT "FK_dfb3de7a7f6c9876554b224fd7b" FOREIGN KEY ("total_id") REFERENCES "invoice_totals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" ADD CONSTRAINT "FK_f22f7faee0fcfbad7c764b49251" FOREIGN KEY ("fiscalInformation_id") REFERENCES "fiscal_informations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoices" DROP CONSTRAINT "FK_f22f7faee0fcfbad7c764b49251"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" DROP CONSTRAINT "FK_dfb3de7a7f6c9876554b224fd7b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permanences" DROP CONSTRAINT "FK_cfaa8584f7f7fe6be09127d6561"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_87223c7f1d4c2ca51cf69927844"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permanences" DROP COLUMN "invoiceId"`,
    );
    await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "invoiceId"`);
    await queryRunner.query(`DROP TABLE "invoices"`);
    await queryRunner.query(`DROP TABLE "invoice_totals"`);
    await queryRunner.query(`DROP TABLE "fiscal_informations"`);
  }
}
