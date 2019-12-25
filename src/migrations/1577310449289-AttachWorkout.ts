import {MigrationInterface, QueryRunner} from "typeorm";

export class AttachWorkout1577310449289 implements MigrationInterface {
    name = 'AttachWorkout1577310449289'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "execution" DROP CONSTRAINT "FK_19a1f978583e8d969848319675b"`, undefined);
        await queryRunner.query(`ALTER TABLE "execution" ADD CONSTRAINT "FK_19a1f978583e8d969848319675b" FOREIGN KEY ("assignmentHistoryId") REFERENCES "assignment_history"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "execution" DROP CONSTRAINT "FK_19a1f978583e8d969848319675b"`, undefined);
        await queryRunner.query(`ALTER TABLE "execution" ADD CONSTRAINT "FK_19a1f978583e8d969848319675b" FOREIGN KEY ("assignmentHistoryId") REFERENCES "assignment_history"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
