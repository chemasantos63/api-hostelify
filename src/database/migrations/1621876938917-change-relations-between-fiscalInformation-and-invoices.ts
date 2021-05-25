import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeRelationsBetweenFiscalInformationAndInvoices1621876938917
  implements MigrationInterface {
  name = 'changeRelationsBetweenFiscalInformationAndInvoices1621876938917';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoices" DROP CONSTRAINT "FK_f22f7faee0fcfbad7c764b49251"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "invoices"."fiscalInformation_id" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" DROP CONSTRAINT "REL_f22f7faee0fcfbad7c764b4925"`,
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
      `ALTER TABLE "invoices" ADD CONSTRAINT "REL_f22f7faee0fcfbad7c764b4925" UNIQUE ("fiscalInformation_id")`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "invoices"."fiscalInformation_id" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" ADD CONSTRAINT "FK_f22f7faee0fcfbad7c764b49251" FOREIGN KEY ("fiscalInformation_id") REFERENCES "fiscal_informations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
