import {MigrationInterface, QueryRunner} from "typeorm";

export class Units1573764388600 implements MigrationInterface {
    name = 'Units1573764388600'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ADD "units" jsonb NOT NULL DEFAULT '{"mass":"kg","length":"m"}'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "units"`, undefined);
    }

}
