import {MigrationInterface, QueryRunner} from "typeorm";

export class addingRoomTypesDetail1621620914842 implements MigrationInterface {
    name = 'addingRoomTypesDetail1621620914842'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "room_types_detail" ("id" SERIAL NOT NULL, "roomersQuantity" integer NOT NULL, "price" numeric NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "roomTypeId" integer, CONSTRAINT "PK_0bd2909314f5a0fb6d6a93e02ec" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "room_types_detail" ADD CONSTRAINT "FK_117d2d563a1a32218994e4802bc" FOREIGN KEY ("roomTypeId") REFERENCES "room_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_types_detail" DROP CONSTRAINT "FK_117d2d563a1a32218994e4802bc"`);
        await queryRunner.query(`DROP TABLE "room_types_detail"`);
    }

}
