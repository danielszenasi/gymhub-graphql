import { MigrationInterface, QueryRunner } from "typeorm";

export class AssignmentGroupTrainerNullable1576835267515
  implements MigrationInterface {
  name = "AssignmentGroupTrainerNullable1576835267515";

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "assignment_group" DROP CONSTRAINT "FK_9884ee4efd3e843d170a0a7677a"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_group" ALTER COLUMN "trainerId" DROP NOT NULL`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_group" ADD CONSTRAINT "FK_9884ee4efd3e843d170a0a7677a" FOREIGN KEY ("trainerId") REFERENCES "trainer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "assignment_group" DROP CONSTRAINT "FK_9884ee4efd3e843d170a0a7677a"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_group" ALTER COLUMN "trainerId" SET NOT NULL`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_group" ADD CONSTRAINT "FK_9884ee4efd3e843d170a0a7677a" FOREIGN KEY ("trainerId") REFERENCES "trainer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
  }
}
