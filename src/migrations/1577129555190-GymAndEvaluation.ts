import { MigrationInterface, QueryRunner } from "typeorm";

export class GymAndEvaluation1577129555190 implements MigrationInterface {
  name = "GymAndEvaluation1577129555190";

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "gym_photo" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "gymId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, CONSTRAINT "PK_b39f5ed920d1ac18e7e1f3c8e7e" PRIMARY KEY ("id"))`,
      undefined
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_338bc2408bae2bcb46bdbc6c6f" ON "gym_photo" ("gymId") `,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "gym" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "streetAddress" character varying, "streetNumber" character varying, "city" character varying, "zipCode" character varying, "location" geometry(Point,4326), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, CONSTRAINT "PK_5ec4eaae24cb81794abbd1af787" PRIMARY KEY ("id"))`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "evaluation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nameEn" character varying NOT NULL, "nameHu" character varying NOT NULL, CONSTRAINT "PK_b72edd439b9db736f55b584fa54" PRIMARY KEY ("id"))`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "assignment_history_evaluations_evaluation" ("assignmentHistoryId" uuid NOT NULL, "evaluationId" uuid NOT NULL, CONSTRAINT "PK_4b127e974af2b97855e66e1e8e4" PRIMARY KEY ("assignmentHistoryId", "evaluationId"))`,
      undefined
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_36b6d539903452f4fdf7d184c4" ON "assignment_history_evaluations_evaluation" ("assignmentHistoryId") `,
      undefined
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9be3f730b6e7df4a2ef3147a69" ON "assignment_history_evaluations_evaluation" ("evaluationId") `,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" ADD "gymId" uuid`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_history" ADD "resultId" uuid`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "gym_photo" ADD CONSTRAINT "FK_338bc2408bae2bcb46bdbc6c6f8" FOREIGN KEY ("gymId") REFERENCES "gym"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" ADD CONSTRAINT "FK_9b3167add038b59e85ed446fa88" FOREIGN KEY ("gymId") REFERENCES "gym"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_history" ADD CONSTRAINT "FK_2e41b2ecc929e1b37d8c5a0b5ce" FOREIGN KEY ("resultId") REFERENCES "evaluation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_history_evaluations_evaluation" ADD CONSTRAINT "FK_36b6d539903452f4fdf7d184c4d" FOREIGN KEY ("assignmentHistoryId") REFERENCES "assignment_history"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_history_evaluations_evaluation" ADD CONSTRAINT "FK_9be3f730b6e7df4a2ef3147a694" FOREIGN KEY ("evaluationId") REFERENCES "evaluation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "assignment_history_evaluations_evaluation" DROP CONSTRAINT "FK_9be3f730b6e7df4a2ef3147a694"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_history_evaluations_evaluation" DROP CONSTRAINT "FK_36b6d539903452f4fdf7d184c4d"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_history" DROP CONSTRAINT "FK_2e41b2ecc929e1b37d8c5a0b5ce"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" DROP CONSTRAINT "FK_9b3167add038b59e85ed446fa88"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "gym_photo" DROP CONSTRAINT "FK_338bc2408bae2bcb46bdbc6c6f8"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment_history" DROP COLUMN "resultId"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" DROP COLUMN "gymId"`,
      undefined
    );
    await queryRunner.query(
      `DROP INDEX "IDX_9be3f730b6e7df4a2ef3147a69"`,
      undefined
    );
    await queryRunner.query(
      `DROP INDEX "IDX_36b6d539903452f4fdf7d184c4"`,
      undefined
    );
    await queryRunner.query(
      `DROP TABLE "assignment_history_evaluations_evaluation"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "evaluation"`, undefined);
    await queryRunner.query(`DROP TABLE "gym"`, undefined);
    await queryRunner.query(
      `DROP INDEX "IDX_338bc2408bae2bcb46bdbc6c6f"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "gym_photo"`, undefined);
  }
}
