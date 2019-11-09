import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1573305894731 implements MigrationInterface {
    name = 'Init1573305894731'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "trainer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_8dfa741df6d52a0da8ad93f0c7e" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "inviteToken" character varying, "inviteAccepted" boolean NOT NULL DEFAULT true, "emailConfirmed" boolean NOT NULL DEFAULT true, "emailConfirmToken" character varying, "resetToken" character varying, "resetExpires" TIMESTAMP, "deletedAt" TIMESTAMP, "lastLogin" TIMESTAMP, "trainerProfileId" uuid, "trainerId" uuid, "joinedAt" TIMESTAMP NOT NULL DEFAULT now(), "isSuper" boolean NOT NULL DEFAULT false, CONSTRAINT "REL_71841110d8f0a2961feabb3f5f" UNIQUE ("trainerProfileId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "exercise" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "instructions" character varying NOT NULL, "url" character varying NOT NULL, "measures" jsonb NOT NULL DEFAULT '{}', "categories" jsonb NOT NULL DEFAULT '{}', "bodyParts" jsonb NOT NULL DEFAULT '{}', "userId" uuid, CONSTRAINT "PK_a0f107e3a2ef2742c1e91d97c14" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "workout" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "note" character varying, "userId" uuid NOT NULL, "trainerId" uuid NOT NULL, "startsAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_ea37ec052825688082b19f0d939" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "exercise_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "exerciseId" uuid NOT NULL, "workoutId" uuid NOT NULL, "executed" jsonb NOT NULL, CONSTRAINT "PK_047ac19e4771e5c851cc6bef373" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_71841110d8f0a2961feabb3f5f5" FOREIGN KEY ("trainerProfileId") REFERENCES "trainer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_a21ec2e01c326758614d0116797" FOREIGN KEY ("trainerId") REFERENCES "trainer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "exercise" ADD CONSTRAINT "FK_0600c3e625643c18323ede9ae02" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "workout" ADD CONSTRAINT "FK_5c6e4714ac75eab49d2009f956c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "workout" ADD CONSTRAINT "FK_6607095a780d1d89e3a36a0799d" FOREIGN KEY ("trainerId") REFERENCES "trainer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "exercise_history" ADD CONSTRAINT "FK_aa4e129c5d61e9bb6cde4bd84be" FOREIGN KEY ("exerciseId") REFERENCES "exercise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "exercise_history" ADD CONSTRAINT "FK_aafaa9ae9298bd6b2fb6da844b4" FOREIGN KEY ("workoutId") REFERENCES "workout"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "exercise_history" DROP CONSTRAINT "FK_aafaa9ae9298bd6b2fb6da844b4"`, undefined);
        await queryRunner.query(`ALTER TABLE "exercise_history" DROP CONSTRAINT "FK_aa4e129c5d61e9bb6cde4bd84be"`, undefined);
        await queryRunner.query(`ALTER TABLE "workout" DROP CONSTRAINT "FK_6607095a780d1d89e3a36a0799d"`, undefined);
        await queryRunner.query(`ALTER TABLE "workout" DROP CONSTRAINT "FK_5c6e4714ac75eab49d2009f956c"`, undefined);
        await queryRunner.query(`ALTER TABLE "exercise" DROP CONSTRAINT "FK_0600c3e625643c18323ede9ae02"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_a21ec2e01c326758614d0116797"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_71841110d8f0a2961feabb3f5f5"`, undefined);
        await queryRunner.query(`DROP TABLE "exercise_history"`, undefined);
        await queryRunner.query(`DROP TABLE "workout"`, undefined);
        await queryRunner.query(`DROP TABLE "exercise"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
        await queryRunner.query(`DROP TABLE "trainer"`, undefined);
    }

}
