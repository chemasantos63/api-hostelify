import {MigrationInterface, QueryRunner} from "typeorm";

export class fixingStatusReservationField1616265339826 implements MigrationInterface {
    name = 'fixingStatusReservationField1616265339826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roomers" ("id" SERIAL NOT NULL, "name" character varying(35) NOT NULL, "lastname" character varying(35) NOT NULL, "documentNumber" character varying(60) NOT NULL, "nationality" character varying(30) NOT NULL, "origin" character varying(30) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f53488e881f6393bf5bf38a052d" UNIQUE ("documentNumber"), CONSTRAINT "UQ_25f66624a3cc6785bb6cc70da07" UNIQUE ("nationality"), CONSTRAINT "UQ_901c9656d18e3e76c65a4ec0e41" UNIQUE ("origin"), CONSTRAINT "PK_df7d2ea3fdbd4192814a5be310e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "UQ_97fe06e36dd45d468d0d08f9d4d"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "from"`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "status" character varying NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "fromDate" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "toDate" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "status" character varying NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "salt" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "salt"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "toDate"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "fromDate"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "from" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "UQ_97fe06e36dd45d468d0d08f9d4d" UNIQUE ("from")`);
        await queryRunner.query(`DROP TABLE "roomers"`);
    }

}
