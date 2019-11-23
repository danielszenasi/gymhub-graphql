import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  TableInheritance
} from "typeorm";
import { User } from "./user.entity";
import { Trainer } from "./trainer.entity";
import { AssignmentHistory } from "./assignment-history.entity";
import { AssignmentGroupToWorkoutPlan } from "./assignment-group-to-workout-plan.entity";

export enum AssignmentGroupState {
  PLANNED = "PLANNED",
  FINISHED = "FINISHED"
}

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class AssignmentGroup {
  @PrimaryGeneratedColumn("uuid") id!: string;

  @Column({
    type: "enum",
    enum: AssignmentGroupState,
    default: AssignmentGroupState.PLANNED
  })
  state!: AssignmentGroupState;

  @Column({ nullable: true }) name?: string;

  @Column({ nullable: true }) note?: string;

  @ManyToOne(_ => User)
  user?: User;

  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(_ => Trainer)
  trainer!: Trainer;

  @Column()
  trainerId!: string;

  @Column({ nullable: true })
  startsAt?: Date;

  @OneToMany(
    _ => AssignmentHistory,
    AssignmentHistory => AssignmentHistory.assignmentGroup
  )
  assignmentHistories?: AssignmentHistory[];

  @ManyToOne(
    _ => AssignmentGroup,
    assignmentGroup => assignmentGroup.children
  )
  parent?: AssignmentGroup;

  @OneToMany(
    _ => AssignmentGroup,
    assignmentGroup => assignmentGroup.parent
  )
  children?: AssignmentGroup[];

  @OneToMany(
    _ => AssignmentGroupToWorkoutPlan,
    assignmentGroupToWorkoutPlan => assignmentGroupToWorkoutPlan.assignmentGroup
  )
  public assignmentGroupToWorkoutPlans!: AssignmentGroupToWorkoutPlan[];
}
