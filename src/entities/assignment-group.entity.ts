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

  @Column({ nullable: true })
  public order!: number;

  @Column({ nullable: true }) nameEn?: string;

  @Column({ nullable: true }) nameHu?: string;

  @Column({ nullable: true }) noteEn?: string;

  @Column({ nullable: true }) noteHu?: string;

  @Column({ default: false })
  isPublic!: boolean;

  @ManyToOne(() => User)
  user?: User;

  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => Trainer)
  trainer!: Trainer;

  @Column()
  trainerId!: string;

  @Column({ nullable: true })
  startsAt?: Date;

  @OneToMany(
    () => AssignmentHistory,
    AssignmentHistory => AssignmentHistory.assignmentGroup
  )
  assignmentHistories?: AssignmentHistory[];

  @ManyToOne(
    () => AssignmentGroup,
    assignmentGroup => assignmentGroup.children
  )
  parent?: AssignmentGroup;

  @Column({ nullable: true })
  parentId!: string;

  @OneToMany(
    () => AssignmentGroup,
    assignmentGroup => assignmentGroup.parent
  )
  children?: AssignmentGroup[];

  @OneToMany(
    () => AssignmentGroupToWorkoutPlan,
    assignmentGroupToWorkoutPlan => assignmentGroupToWorkoutPlan.assignmentGroup
  )
  public assignmentGroupToWorkoutPlans!: AssignmentGroupToWorkoutPlan[];
}
