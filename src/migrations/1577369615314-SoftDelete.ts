import {MigrationInterface, QueryRunner} from "typeorm";

export class SoftDelete1577369615314 implements MigrationInterface {
    name = 'SoftDelete1577369615314'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "assignment" ADD "deletedAt" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment_group" ADD "deletedAt" TIMESTAMP`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "assignment_group" DROP COLUMN "deletedAt"`, undefined);
        await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "deletedAt"`, undefined);
    }

}
