import {MigrationInterface, QueryRunner} from "typeorm";

export class RRule1578605903003 implements MigrationInterface {
    name = 'RRule1578605903003'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "assignment_group" ADD "rrule" character varying`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "assignment_group" DROP COLUMN "rrule"`, undefined);
    }

}
