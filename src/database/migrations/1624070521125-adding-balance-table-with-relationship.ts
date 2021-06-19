import {MigrationInterface, QueryRunner} from "typeorm";

export class addingBalanceTableWithRelationship1624070521125 implements MigrationInterface {
    name = 'addingBalanceTableWithRelationship1624070521125'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "balances" ("id" SERIAL NOT NULL, "initialBalance" numeric DEFAULT '0', "cashTotal" numeric DEFAULT '0', "cardTotal" numeric DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, CONSTRAINT "PK_74904758e813e401abc3d4261c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "balance_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD "balance_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_fff1bf37dc590b3996ca78f2db2" FOREIGN KEY ("balance_id") REFERENCES "balances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_f47e37520f3d6228fabf6f4c083" FOREIGN KEY ("balance_id") REFERENCES "balances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "balances" ADD CONSTRAINT "FK_864b90e3b151018347577be4f97" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "balances" DROP CONSTRAINT "FK_864b90e3b151018347577be4f97"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_f47e37520f3d6228fabf6f4c083"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_fff1bf37dc590b3996ca78f2db2"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP COLUMN "balance_id"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "balance_id"`);
        await queryRunner.query(`DROP TABLE "balances"`);
    }

}
