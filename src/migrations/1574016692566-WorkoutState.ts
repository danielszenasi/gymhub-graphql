import {MigrationInterface, QueryRunner} from "typeorm";

export class WorkoutState1574016692566 implements MigrationInterface {
    name = 'WorkoutState1574016692566'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "workout" RENAME COLUMN "role" TO "state"`, undefined);
        await queryRunner.query(`ALTER TYPE "public"."workout_role_enum" RENAME TO "workout_state_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "units" SET DEFAULT '{"mass":"kg","length":"m"}'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "units" SET DEFAULT '{"mass": "kg", "length": "m"}'`, undefined);
        await queryRunner.query(`ALTER TYPE "workout_state_enum" RENAME TO "workout_role_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "workout" RENAME COLUMN "state" TO "role"`, undefined);
    }

}
