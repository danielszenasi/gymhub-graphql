import {MigrationInterface, QueryRunner} from "typeorm";

export class Assignment1574503621035 implements MigrationInterface {
    name = 'Assignment1574503621035'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "trainer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_8dfa741df6d52a0da8ad93f0c7e" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "assignment_group_to_workout_plan" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "assignmentGroupId" character varying NOT NULL, "workoutPlanId" uuid NOT NULL, "order" integer NOT NULL, "workoutId" uuid, CONSTRAINT "PK_013902b04d8d7ec3b44dc97a1a8" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "workout_plan" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "numberOfWorkoutsPerWeek" integer NOT NULL, "userId" uuid, CONSTRAINT "PK_aea7bdb578979ab3fd974331f5c" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "inviteToken" character varying, "inviteAccepted" boolean NOT NULL DEFAULT true, "emailConfirmed" boolean NOT NULL DEFAULT true, "emailConfirmToken" character varying, "resetToken" character varying, "resetExpires" TIMESTAMP, "deletedAt" TIMESTAMP, "lastLogin" TIMESTAMP, "trainerProfileId" uuid, "trainerId" uuid, "joinedAt" TIMESTAMP NOT NULL DEFAULT now(), "isSuper" boolean NOT NULL DEFAULT false, "units" jsonb NOT NULL DEFAULT '{"mass":"kg","length":"m"}', "workoutPlanId" uuid, CONSTRAINT "REL_71841110d8f0a2961feabb3f5f" UNIQUE ("trainerProfileId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "assignment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "url" character varying, "measures" jsonb NOT NULL DEFAULT '{}', "categories" jsonb NOT NULL DEFAULT '{}', "bodyParts" jsonb NOT NULL DEFAULT '{}', "userId" uuid, "type" character varying NOT NULL, CONSTRAINT "PK_43c2f5a3859f54cedafb270f37e" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_ff7e3a3d1d3fa006bb4d23aff6" ON "assignment" ("type") `, undefined);
        await queryRunner.query(`CREATE TABLE "assignment_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order" integer NOT NULL DEFAULT 0, "startsAt" TIMESTAMP, "assignmentId" uuid NOT NULL, "assignmentGroupId" uuid NOT NULL, "executed" jsonb NOT NULL, CONSTRAINT "PK_9e3ec8e134976ba55ea4043b7bd" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "assignment_group_state_enum" AS ENUM('PLANNED', 'FINISHED')`, undefined);
        await queryRunner.query(`CREATE TABLE "assignment_group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "state" "assignment_group_state_enum" NOT NULL DEFAULT 'PLANNED', "name" character varying, "note" character varying, "userId" uuid, "trainerId" uuid NOT NULL, "startsAt" TIMESTAMP, "type" character varying NOT NULL, "parentId" uuid, CONSTRAINT "PK_e66aa4c08e954f98fa721ef9567" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_847d2628a4028ca00dc5635a01" ON "assignment_group" ("type") `, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_group_to_workout_plan" ADD CONSTRAINT "FK_de14b4e7809857ba2d99632b368" FOREIGN KEY ("workoutId") REFERENCES "assignment_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_group_to_workout_plan" ADD CONSTRAINT "FK_55df1a0d7b4c5d556a29f0f06e2" FOREIGN KEY ("workoutPlanId") REFERENCES "workout_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "workout_plan" ADD CONSTRAINT "FK_5414926acb1a1a08bebf7b33bc3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_71841110d8f0a2961feabb3f5f5" FOREIGN KEY ("trainerProfileId") REFERENCES "trainer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_a21ec2e01c326758614d0116797" FOREIGN KEY ("trainerId") REFERENCES "trainer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_15bd98df737b545d17d1f7cd673" FOREIGN KEY ("workoutPlanId") REFERENCES "workout_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment" ADD CONSTRAINT "FK_b3ae3ab674b9ba61a5771e906da" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_history" ADD CONSTRAINT "FK_c19e296c04604b1259fcbd60b5c" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_history" ADD CONSTRAINT "FK_3c31999ab80485116573c593414" FOREIGN KEY ("assignmentGroupId") REFERENCES "assignment_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_group" ADD CONSTRAINT "FK_abe72beb064c8e6b00484cc0beb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_group" ADD CONSTRAINT "FK_9884ee4efd3e843d170a0a7677a" FOREIGN KEY ("trainerId") REFERENCES "trainer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_group" ADD CONSTRAINT "FK_8bfa07c55d44387648729956779" FOREIGN KEY ("parentId") REFERENCES "assignment_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "assignment_group" DROP CONSTRAINT "FK_8bfa07c55d44387648729956779"`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_group" DROP CONSTRAINT "FK_9884ee4efd3e843d170a0a7677a"`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_group" DROP CONSTRAINT "FK_abe72beb064c8e6b00484cc0beb"`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_history" DROP CONSTRAINT "FK_3c31999ab80485116573c593414"`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_history" DROP CONSTRAINT "FK_c19e296c04604b1259fcbd60b5c"`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment" DROP CONSTRAINT "FK_b3ae3ab674b9ba61a5771e906da"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_15bd98df737b545d17d1f7cd673"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_a21ec2e01c326758614d0116797"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_71841110d8f0a2961feabb3f5f5"`, undefined);
        await queryRunner.query(`ALTER TABLE "workout_plan" DROP CONSTRAINT "FK_5414926acb1a1a08bebf7b33bc3"`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_group_to_workout_plan" DROP CONSTRAINT "FK_55df1a0d7b4c5d556a29f0f06e2"`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_group_to_workout_plan" DROP CONSTRAINT "FK_de14b4e7809857ba2d99632b368"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_847d2628a4028ca00dc5635a01"`, undefined);
        await queryRunner.query(`DROP TABLE "assignment_group"`, undefined);
        await queryRunner.query(`DROP TYPE "assignment_group_state_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "assignment_history"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_ff7e3a3d1d3fa006bb4d23aff6"`, undefined);
        await queryRunner.query(`DROP TABLE "assignment"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
        await queryRunner.query(`DROP TABLE "workout_plan"`, undefined);
        await queryRunner.query(`DROP TABLE "assignment_group_to_workout_plan"`, undefined);
        await queryRunner.query(`DROP TABLE "trainer"`, undefined);
    }

}
