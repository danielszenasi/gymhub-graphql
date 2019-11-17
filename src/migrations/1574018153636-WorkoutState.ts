import {MigrationInterface, QueryRunner} from "typeorm";

export class WorkoutState1574018153636 implements MigrationInterface {
    name = 'WorkoutState1574018153636'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "workout_state_enum" AS ENUM('CREATED', 'FINISHED')`, undefined);
        await queryRunner.query(`ALTER TABLE "workout" ADD "state" "workout_state_enum" NOT NULL DEFAULT 'CREATED'`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "units" SET DEFAULT '{"mass":"kg","length":"m"}'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "units" SET DEFAULT '{"mass": "kg", "length": "m"}'`, undefined);
        await queryRunner.query(`ALTER TABLE "workout" DROP COLUMN "state"`, undefined);
        await queryRunner.query(`DROP TYPE "workout_state_enum"`, undefined);
    }

}
