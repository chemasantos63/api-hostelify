import { MigrationInterface, QueryRunner } from 'typeorm';

export class addingProductToInvoiceDetail1627337146084
  implements MigrationInterface {
  name = 'addingProductToInvoiceDetail1627337146084';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoices_report_detail" ADD "product_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices_report_detail" ADD CONSTRAINT "FK_f36cdaf0d6f02c27e46c214039e" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoices_report_detail" DROP CONSTRAINT "FK_f36cdaf0d6f02c27e46c214039e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices_report_detail" DROP COLUMN "product_id"`,
    );
  }
}
