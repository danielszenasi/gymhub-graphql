import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Measure } from "./measure.entity";
import { AssignmentHistory } from "./assignment-history.entity";

@Entity()
export class Execution {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @ManyToOne(
    () => Measure,
    measure => measure.executions
  )
  measure: Measure;

  @ManyToOne(
    () => AssignmentHistory,
    assignmentHistory => assignmentHistory.executions
  )
  assignmentHistory!: AssignmentHistory;

  @Column()
  measureId: string;

  @Column()
  value: number;
}
