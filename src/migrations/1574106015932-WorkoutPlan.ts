import {MigrationInterface, QueryRunner} from "typeorm";

export class WorkoutPlan1574106015932 implements MigrationInterface {
    name = 'WorkoutPlan1574106015932'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "workout" ADD "parentId" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "units" SET DEFAULT '{"mass":"kg","length":"m"}'`, undefined);
        await queryRunner.query(`ALTER TABLE "workout" ADD CONSTRAINT "FK_0890ddb3c59af474d3973151f4c" FOREIGN KEY ("parentId") REFERENCES "workout"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "workout" DROP CONSTRAINT "FK_0890ddb3c59af474d3973151f4c"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "units" SET DEFAULT '{"mass": "kg", "length": "m"}'`, undefined);
        await queryRunner.query(`ALTER TABLE "workout" DROP COLUMN "parentId"`, undefined);
    }

}
