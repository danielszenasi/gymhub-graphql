import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1576937086310 implements MigrationInterface {
    name = 'Init1576937086310'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "trainer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_8dfa741df6d52a0da8ad93f0c7e" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "user_measuresystem_enum" AS ENUM('metric', 'imperial')`, undefined);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "profileImageUrl" character varying, "inviteToken" character varying, "inviteAccepted" boolean NOT NULL DEFAULT true, "emailConfirmed" boolean NOT NULL DEFAULT true, "emailConfirmToken" character varying, "resetToken" character varying, "resetExpires" TIMESTAMP, "deletedAt" TIMESTAMP, "lastLogin" TIMESTAMP, "trainerProfileId" uuid, "trainerId" uuid, "joinedAt" TIMESTAMP NOT NULL DEFAULT now(), "isSuper" boolean NOT NULL DEFAULT false, "measureSystem" "user_measuresystem_enum" NOT NULL DEFAULT 'imperial', "workoutPlanId" uuid, CONSTRAINT "REL_71841110d8f0a2961feabb3f5f" UNIQUE ("trainerProfileId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "workout_plan" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "numberOfWorkoutsPerWeek" integer NOT NULL, "userId" uuid, CONSTRAINT "PK_aea7bdb578979ab3fd974331f5c" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nameEn" character varying NOT NULL, "nameHu" character varying NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "body_part" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nameEn" character varying NOT NULL, "nameHu" character varying NOT NULL, CONSTRAINT "PK_5aeef7f1ba0d7bbce84c4e78e2e" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "execution" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "measureId" uuid NOT NULL, "value" integer NOT NULL, "assignmentHistoryId" uuid, CONSTRAINT "PK_cc6684fedf29ec4c86db8448a2b" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "measure" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nameEn" character varying NOT NULL, "nameHu" character varying NOT NULL, "accurancy" integer, CONSTRAINT "PK_ddc1ad2a86717cedc808809423e" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "assignment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nameEn" character varying, "nameHu" character varying, "descriptionEn" character varying, "descriptionHu" character varying, "url" character varying, "userId" uuid NOT NULL, "isPublic" boolean NOT NULL DEFAULT false, "type" character varying NOT NULL, CONSTRAINT "PK_43c2f5a3859f54cedafb270f37e" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_ff7e3a3d1d3fa006bb4d23aff6" ON "assignment" ("type") `, undefined);
        await queryRunner.query(`CREATE TABLE "assignment_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order" integer NOT NULL DEFAULT 0, "startsAt" TIMESTAMP, "assignmentId" uuid NOT NULL, "assignmentGroupId" uuid NOT NULL, CONSTRAINT "PK_9e3ec8e134976ba55ea4043b7bd" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "assignment_group_state_enum" AS ENUM('PLANNED', 'FINISHED')`, undefined);
        await queryRunner.query(`CREATE TABLE "assignment_group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "state" "assignment_group_state_enum" NOT NULL DEFAULT 'PLANNED', "order" integer, "nameEn" character varying, "nameHu" character varying, "noteEn" character varying, "noteHu" character varying, "isPublic" boolean NOT NULL DEFAULT false, "userId" uuid, "trainerId" uuid NOT NULL, "startsAt" TIMESTAMP, "parentId" uuid, "type" character varying NOT NULL, CONSTRAINT "PK_e66aa4c08e954f98fa721ef9567" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_847d2628a4028ca00dc5635a01" ON "assignment_group" ("type") `, undefined);
        await queryRunner.query(`CREATE TABLE "assignment_group_to_workout_plan" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "assignmentGroupId" uuid NOT NULL, "workoutPlanId" uuid NOT NULL, "order" integer NOT NULL, CONSTRAINT "PK_013902b04d8d7ec3b44dc97a1a8" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "assignment_measures_measure" ("assignmentId" uuid NOT NULL, "measureId" uuid NOT NULL, CONSTRAINT "PK_ed12bcac0e2a0ef4b3fc26a96a7" PRIMARY KEY ("assignmentId", "measureId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_11269f5732846fc4c68e72a672" ON "assignment_measures_measure" ("assignmentId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_e3349208529d7f3841b561ad4a" ON "assignment_measures_measure" ("measureId") `, undefined);
        await queryRunner.query(`CREATE TABLE "assignment_categories_category" ("assignmentId" uuid NOT NULL, "categoryId" uuid NOT NULL, CONSTRAINT "PK_8459e4cb2eab1670e8d285091a1" PRIMARY KEY ("assignmentId", "categoryId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_e6c01cccc5547a8c45cc7acf5d" ON "assignment_categories_category" ("assignmentId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_6c447f34c11086d37cdbc1b585" ON "assignment_categories_category" ("categoryId") `, undefined);
        await queryRunner.query(`CREATE TABLE "assignment_body_parts_body_part" ("assignmentId" uuid NOT NULL, "bodyPartId" uuid NOT NULL, CONSTRAINT "PK_bd832356fe4254538c8afb36cda" PRIMARY KEY ("assignmentId", "bodyPartId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_1e2be4f5e8cc99da3eb18ea6f0" ON "assignment_body_parts_body_part" ("assignmentId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_2b9ddefcae920af88e4d1c1d04" ON "assignment_body_parts_body_part" ("bodyPartId") `, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_71841110d8f0a2961feabb3f5f5" FOREIGN KEY ("trainerProfileId") REFERENCES "trainer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_a21ec2e01c326758614d0116797" FOREIGN KEY ("trainerId") REFERENCES "trainer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_15bd98df737b545d17d1f7cd673" FOREIGN KEY ("workoutPlanId") REFERENCES "workout_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "workout_plan" ADD CONSTRAINT "FK_5414926acb1a1a08bebf7b33bc3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "execution" ADD CONSTRAINT "FK_e69d88dc8865ea47d5abfb153c4" FOREIGN KEY ("measureId") REFERENCES "measure"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "execution" ADD CONSTRAINT "FK_19a1f978583e8d969848319675b" FOREIGN KEY ("assignmentHistoryId") REFERENCES "assignment_history"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment" ADD CONSTRAINT "FK_b3ae3ab674b9ba61a5771e906da" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_history" ADD CONSTRAINT "FK_c19e296c04604b1259fcbd60b5c" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_history" ADD CONSTRAINT "FK_3c31999ab80485116573c593414" FOREIGN KEY ("assignmentGroupId") REFERENCES "assignment_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_group" ADD CONSTRAINT "FK_abe72beb064c8e6b00484cc0beb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_group" ADD CONSTRAINT "FK_9884ee4efd3e843d170a0a7677a" FOREIGN KEY ("trainerId") REFERENCES "trainer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_group" ADD CONSTRAINT "FK_8bfa07c55d44387648729956779" FOREIGN KEY ("parentId") REFERENCES "assignment_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_group_to_workout_plan" ADD CONSTRAINT "FK_a173c74da1b2f1bd4741dafe869" FOREIGN KEY ("assignmentGroupId") REFERENCES "assignment_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_group_to_workout_plan" ADD CONSTRAINT "FK_55df1a0d7b4c5d556a29f0f06e2" FOREIGN KEY ("workoutPlanId") REFERENCES "workout_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_measures_measure" ADD CONSTRAINT "FK_11269f5732846fc4c68e72a6721" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_measures_measure" ADD CONSTRAINT "FK_e3349208529d7f3841b561ad4ab" FOREIGN KEY ("measureId") REFERENCES "measure"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_categories_category" ADD CONSTRAINT "FK_e6c01cccc5547a8c45cc7acf5d1" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_categories_category" ADD CONSTRAINT "FK_6c447f34c11086d37cdbc1b585e" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_body_parts_body_part" ADD CONSTRAINT "FK_1e2be4f5e8cc99da3eb18ea6f0e" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_body_parts_body_part" ADD CONSTRAINT "FK_2b9ddefcae920af88e4d1c1d04a" FOREIGN KEY ("bodyPartId") REFERENCES "body_part"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "assignment_body_parts_body_part" DROP CONSTRAINT "FK_2b9ddefcae920af88e4d1c1d04a"`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_body_parts_body_part" DROP CONSTRAINT "FK_1e2be4f5e8cc99da3eb18ea6f0e"`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_categories_category" DROP CONSTRAINT "FK_6c447f34c11086d37cdbc1b585e"`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_categories_category" DROP CONSTRAINT "FK_e6c01cccc5547a8c45cc7acf5d1"`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_measures_measure" DROP CONSTRAINT "FK_e3349208529d7f3841b561ad4ab"`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_measures_measure" DROP CONSTRAINT "FK_11269f5732846fc4c68e72a6721"`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_group_to_workout_plan" DROP CONSTRAINT "FK_55df1a0d7b4c5d556a29f0f06e2"`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_group_to_workout_plan" DROP CONSTRAINT "FK_a173c74da1b2f1bd4741dafe869"`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_group" DROP CONSTRAINT "FK_8bfa07c55d44387648729956779"`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_group" DROP CONSTRAINT "FK_9884ee4efd3e843d170a0a7677a"`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_group" DROP CONSTRAINT "FK_abe72beb064c8e6b00484cc0beb"`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_history" DROP CONSTRAINT "FK_3c31999ab80485116573c593414"`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_history" DROP CONSTRAINT "FK_c19e296c04604b1259fcbd60b5c"`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment" DROP CONSTRAINT "FK_b3ae3ab674b9ba61a5771e906da"`, undefined);
        await queryRunner.query(`ALTER TABLE "execution" DROP CONSTRAINT "FK_19a1f978583e8d969848319675b"`, undefined);
        await queryRunner.query(`ALTER TABLE "execution" DROP CONSTRAINT "FK_e69d88dc8865ea47d5abfb153c4"`, undefined);
        await queryRunner.query(`ALTER TABLE "workout_plan" DROP CONSTRAINT "FK_5414926acb1a1a08bebf7b33bc3"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_15bd98df737b545d17d1f7cd673"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_a21ec2e01c326758614d0116797"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_71841110d8f0a2961feabb3f5f5"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_2b9ddefcae920af88e4d1c1d04"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_1e2be4f5e8cc99da3eb18ea6f0"`, undefined);
        await queryRunner.query(`DROP TABLE "assignment_body_parts_body_part"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_6c447f34c11086d37cdbc1b585"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_e6c01cccc5547a8c45cc7acf5d"`, undefined);
        await queryRunner.query(`DROP TABLE "assignment_categories_category"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_e3349208529d7f3841b561ad4a"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_11269f5732846fc4c68e72a672"`, undefined);
        await queryRunner.query(`DROP TABLE "assignment_measures_measure"`, undefined);
        await queryRunner.query(`DROP TABLE "assignment_group_to_workout_plan"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_847d2628a4028ca00dc5635a01"`, undefined);
        await queryRunner.query(`DROP TABLE "assignment_group"`, undefined);
        await queryRunner.query(`DROP TYPE "assignment_group_state_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "assignment_history"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_ff7e3a3d1d3fa006bb4d23aff6"`, undefined);
        await queryRunner.query(`DROP TABLE "assignment"`, undefined);
        await queryRunner.query(`DROP TABLE "measure"`, undefined);
        await queryRunner.query(`DROP TABLE "execution"`, undefined);
        await queryRunner.query(`DROP TABLE "body_part"`, undefined);
        await queryRunner.query(`DROP TABLE "category"`, undefined);
        await queryRunner.query(`DROP TABLE "workout_plan"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
        await queryRunner.query(`DROP TYPE "user_measuresystem_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "trainer"`, undefined);
    }

}
