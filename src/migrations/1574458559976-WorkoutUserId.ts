import { MigrationInterface, QueryRunner } from "typeorm";

export class WorkoutUserId1574458559976 implements MigrationInterface {
  name = "WorkoutUserId1574458559976";

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "workout" DROP CONSTRAINT "FK_5c6e4714ac75eab49d2009f956c"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "workout" ALTER COLUMN "userId" DROP NOT NULL`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "workout" ADD CONSTRAINT "FK_5c6e4714ac75eab49d2009f956c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "workout" DROP CONSTRAINT "FK_5c6e4714ac75eab49d2009f956c"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "workout" ALTER COLUMN "userId" SET NOT NULL`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "workout" ADD CONSTRAINT "FK_5c6e4714ac75eab49d2009f956c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
  }
}
