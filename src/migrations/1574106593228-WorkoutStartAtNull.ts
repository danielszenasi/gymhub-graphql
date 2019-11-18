import { MigrationInterface, QueryRunner } from "typeorm";

export class WorkoutStartAtNull1574106593228 implements MigrationInterface {
  name = "WorkoutStartAtNull1574106593228";

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "workout" ALTER COLUMN "startsAt" DROP NOT NULL`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "workout" ALTER COLUMN "startsAt" SET NOT NULL`,
      undefined
    );
  }
}
