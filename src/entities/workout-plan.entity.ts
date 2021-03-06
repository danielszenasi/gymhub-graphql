import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Column,
  ManyToOne
} from "typeorm";
import { AssignmentGroupToWorkoutPlan } from "./assignment-group-to-workout-plan.entity";
import { User } from "./user.entity";

@Entity()
export class WorkoutPlan {
  @PrimaryGeneratedColumn("uuid") id!: string;

  @Column() name!: string;

  @Column() numberOfWorkoutsPerWeek!: number;

  @ManyToOne(() => User)
  user?: User;

  @Column({ nullable: true }) userId?: string;

  @OneToMany(
    () => AssignmentGroupToWorkoutPlan,
    assignmentGroupToWorkoutPlan => assignmentGroupToWorkoutPlan.workoutPlan
  )
  public assignmentGroupToWorkoutPlans!: AssignmentGroupToWorkoutPlan[];
}
