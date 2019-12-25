import {MigrationInterface, QueryRunner} from "typeorm";

export class ExecutionDelete1577309517846 implements MigrationInterface {
    name = 'ExecutionDelete1577309517846'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "execution" DROP CONSTRAINT "FK_19a1f978583e8d969848319675b"`, undefined);
        await queryRunner.query(`ALTER TABLE "execution" ADD CONSTRAINT "FK_19a1f978583e8d969848319675b" FOREIGN KEY ("assignmentHistoryId") REFERENCES "assignment_history"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "execution" DROP CONSTRAINT "FK_19a1f978583e8d969848319675b"`, undefined);
        await queryRunner.query(`ALTER TABLE "execution" ADD CONSTRAINT "FK_19a1f978583e8d969848319675b" FOREIGN KEY ("assignmentHistoryId") REFERENCES "assignment_history"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
