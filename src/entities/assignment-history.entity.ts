import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Assignment } from "./assignment.entity";
import { AssignmentGroup } from "./assignment-group.entity";

@Entity()
export class AssignmentHistory {
  @PrimaryGeneratedColumn("uuid") id!: string;

  @Column({ default: 0 }) order!: number;

  @Column({ nullable: true })
  startsAt?: Date;

  @ManyToOne(
    _ => Assignment,
    Assignment => Assignment.assignmentHistory
  )
  assignment!: Assignment;

  @Column() assignmentId!: string;

  @ManyToOne(
    _ => AssignmentGroup,
    AssignmentGroup => AssignmentGroup.assignmentHistories
  )
  assignmentGroup!: AssignmentGroup;

  @Column() assignmentGroupId!: string;

  @Column({ type: "jsonb" })
  executed!: any;
}
