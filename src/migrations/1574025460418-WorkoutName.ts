import {MigrationInterface, QueryRunner} from "typeorm";

export class WorkoutName1574025460418 implements MigrationInterface {
    name = 'WorkoutName1574025460418'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "workout" ADD "name" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "units" SET DEFAULT '{"mass":"kg","length":"m"}'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "units" SET DEFAULT '{"mass": "kg", "length": "m"}'`, undefined);
        await queryRunner.query(`ALTER TABLE "workout" DROP COLUMN "name"`, undefined);
    }

}
