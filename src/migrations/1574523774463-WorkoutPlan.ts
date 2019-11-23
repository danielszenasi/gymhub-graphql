import { MigrationInterface, QueryRunner } from "typeorm";

export class WorkoutPlan1574523774463 implements MigrationInterface {
  name = "WorkoutPlan1574523774463";

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "assignment_group_to_workout_plan" DROP CONSTRAINT "FK_de14b4e7809857ba2d99632b368"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_group_to_workout_plan" DROP COLUMN "workoutId"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_group_to_workout_plan" DROP COLUMN "assignmentGroupId"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_group_to_workout_plan" ADD "assignmentGroupId" uuid NOT NULL`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_group_to_workout_plan" ADD CONSTRAINT "FK_a173c74da1b2f1bd4741dafe869" FOREIGN KEY ("assignmentGroupId") REFERENCES "assignment_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "assignment_group_to_workout_plan" DROP CONSTRAINT "FK_a173c74da1b2f1bd4741dafe869"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_group_to_workout_plan" DROP COLUMN "assignmentGroupId"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_group_to_workout_plan" ADD "assignmentGroupId" character varying NOT NULL`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_group_to_workout_plan" ADD "workoutId" uuid`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_group_to_workout_plan" ADD CONSTRAINT "FK_de14b4e7809857ba2d99632b368" FOREIGN KEY ("workoutId") REFERENCES "assignment_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
  }
}
