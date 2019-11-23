import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { WorkoutPlan } from "./workout-plan.entity";
import { AssignmentGroup } from "./assignment-group.entity";

@Entity()
export class AssignmentGroupToWorkoutPlan {
  @PrimaryGeneratedColumn("uuid")
  public id!: number;

  @Column()
  public assignmentGroupId!: string;

  @Column()
  public workoutPlanId!: string;

  @Column()
  public order!: number;

  @ManyToOne(
    _ => AssignmentGroup,
    assignmentGroup => assignmentGroup.assignmentGroupToWorkoutPlans
  )
  public workout!: AssignmentGroup;

  @ManyToOne(
    _ => WorkoutPlan,
    workoutPlan => workoutPlan.assignmentGroupToWorkoutPlans
  )
  public workoutPlan!: WorkoutPlan;
}
