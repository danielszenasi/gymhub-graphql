import { MigrationInterface, QueryRunner } from "typeorm";

export class WorkoutState1574104160680 implements MigrationInterface {
  name = "WorkoutState1574104160680";

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `UPDATE "workout" SET "state" = 'FINISHED'`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "units" SET DEFAULT '{"mass":"kg","length":"m"}'`,
      undefined
    );
    await queryRunner.query(
      `ALTER TYPE "public"."workout_state_enum" RENAME TO "workout_state_enum_old"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TYPE "workout_state_enum" AS ENUM('PLANNED', 'FINISHED')`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "workout" ALTER COLUMN "state" DROP DEFAULT`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "workout" ALTER COLUMN "state" TYPE "workout_state_enum" USING "state"::"text"::"workout_state_enum"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "workout" ALTER COLUMN "state" SET DEFAULT 'PLANNED'`,
      undefined
    );
    await queryRunner.query(`DROP TYPE "workout_state_enum_old"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "workout" ALTER COLUMN "state" SET DEFAULT 'PLANNED'`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "workout" ALTER COLUMN "state" SET DEFAULT 'CREATED'`,
      undefined
    );
    await queryRunner.query(
      `CREATE TYPE "workout_state_enum_old" AS ENUM('CREATED', 'FINISHED')`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "workout" ALTER COLUMN "state" DROP DEFAULT`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "workout" ALTER COLUMN "state" TYPE "workout_state_enum_old" USING "state"::"text"::"workout_state_enum_old"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "workout" ALTER COLUMN "state" SET DEFAULT 'PLANNED'`,
      undefined
    );
    await queryRunner.query(`DROP TYPE "workout_state_enum"`, undefined);
    await queryRunner.query(
      `ALTER TYPE "workout_state_enum_old" RENAME TO  "workout_state_enum"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "units" SET DEFAULT '{"mass": "kg", "length": "m"}'`,
      undefined
    );
  }
}
