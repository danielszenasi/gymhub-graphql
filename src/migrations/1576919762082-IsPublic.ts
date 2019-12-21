import { MigrationInterface, QueryRunner } from "typeorm";

export class IsPublic1576919762082 implements MigrationInterface {
  name = "IsPublic1576919762082";

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "assignment" ADD "isPublic" boolean NOT NULL DEFAULT false`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_group" ADD "isPublic" boolean NOT NULL DEFAULT false`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" DROP CONSTRAINT "FK_b3ae3ab674b9ba61a5771e906da"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" ALTER COLUMN "userId" SET NOT NULL`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_group" DROP CONSTRAINT "FK_9884ee4efd3e843d170a0a7677a"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_group" ALTER COLUMN "trainerId" SET NOT NULL`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" ADD CONSTRAINT "FK_b3ae3ab674b9ba61a5771e906da" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "assignment" DROP CONSTRAINT "FK_b3ae3ab674b9ba61a5771e906da"`,
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
    await queryRunner.query(
      `ALTER TABLE "assignment" ALTER COLUMN "userId" DROP NOT NULL`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" ADD CONSTRAINT "FK_b3ae3ab674b9ba61a5771e906da" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_group" DROP COLUMN "isPublic"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" DROP COLUMN "isPublic"`,
      undefined
    );
  }
}
