import { MigrationInterface, QueryRunner } from 'typeorm';

export class addingProductTable1627002574867 implements MigrationInterface {
  name = 'addingProductTable1627002574867';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "products" ("id" SERIAL NOT NULL, "description" character varying(50) NOT NULL, "code" character varying(25) NOT NULL, "price" numeric NOT NULL DEFAULT '0', "altPrice" numeric NOT NULL DEFAULT '0', "stock" numeric NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer NOT NULL, "updated_by" integer NOT NULL, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_c1af9b47239151e255f62e03247" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_4b9f1600a4f721ac017eefb03ee" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_4b9f1600a4f721ac017eefb03ee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_c1af9b47239151e255f62e03247"`,
    );
    await queryRunner.query(`DROP TABLE "products"`);
  }
}
