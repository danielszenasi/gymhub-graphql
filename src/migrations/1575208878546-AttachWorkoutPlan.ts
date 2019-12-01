import { MigrationInterface, QueryRunner } from "typeorm";

export class AttachWorkoutPlan1575208878546 implements MigrationInterface {
  name = "AttachWorkoutPlan1575208878546";

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "assignment_group" ADD "order" integer`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "assignment_group" DROP COLUMN "order"`,
      undefined
    );
  }
}
