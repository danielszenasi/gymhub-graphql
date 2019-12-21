import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToMany
} from "typeorm";
import { Assignment } from "./assignment.entity";
import { AssignmentGroup } from "./assignment-group.entity";
import { Execution } from "./execution.entity";

@Entity()
export class AssignmentHistory {
  @PrimaryGeneratedColumn("uuid") id!: string;

  @Column({ default: 0 }) order!: number;

  @Column({ nullable: true })
  startsAt?: Date;

  @ManyToOne(
    () => Assignment,
    assignment => assignment.assignmentHistories
  )
  assignment!: Assignment;

  @Column() assignmentId!: string;

  @ManyToOne(
    () => AssignmentGroup,
    AssignmentGroup => AssignmentGroup.assignmentHistories
  )
  assignmentGroup!: AssignmentGroup;

  @Column() assignmentGroupId!: string;

  @OneToMany(
    () => Execution,
    execution => execution.assignmentHistory,
    { cascade: true }
  )
  executions: Execution[];
}
