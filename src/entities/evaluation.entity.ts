import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany
} from "typeorm";
import { AssignmentHistory } from "./assignment-history.entity";

@Entity()
export class Evaluation {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Column()
  nameEn!: string;

  @Column()
  nameHu!: string;

  @ManyToMany(
    () => AssignmentHistory,
    assignmentHistory => assignmentHistory.evaluations
  )
  assignmentHistories: AssignmentHistory[];

  @OneToMany(
    () => AssignmentHistory,
    assignmentHistory => assignmentHistory.result
  )
  selectedAssignmentHistories: AssignmentHistory[];
}
