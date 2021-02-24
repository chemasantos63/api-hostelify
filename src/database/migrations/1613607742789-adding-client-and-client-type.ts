import { MigrationInterface, QueryRunner } from 'typeorm';

export class addingClientAndClientType1613607742789
  implements MigrationInterface {
  name = 'addingClientAndClientType1613607742789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "customer_types" ("id" SERIAL NOT NULL, "type" character varying(15) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_641fdf11f88e144cc1378538ba7" UNIQUE ("type"), CONSTRAINT "PK_41189e434bffa8b2983bcc5bf07" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "customers" ("id" SERIAL NOT NULL, "name" character varying(35) NOT NULL, "lastname" character varying(35) NOT NULL, "documentNumber" character varying(60) NOT NULL, "phone" character varying(30) NOT NULL, "email" character varying(30) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type_id" integer NOT NULL, CONSTRAINT "UQ_dffea8343d90688bccac70b63ad" UNIQUE ("documentNumber"), CONSTRAINT "REL_c3591e1038438829450dff973b" UNIQUE ("type_id"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD CONSTRAINT "FK_c3591e1038438829450dff973b7" FOREIGN KEY ("type_id") REFERENCES "customer_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" DROP CONSTRAINT "FK_c3591e1038438829450dff973b7"`,
    );
    await queryRunner.query(`DROP TABLE "customers"`);
    await queryRunner.query(`DROP TABLE "customer_types"`);
  }
}
