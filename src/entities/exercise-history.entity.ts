import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Exercise } from "./exercise.entity";
import { Workout } from "./workout.entity";

@Entity()
export class ExerciseHistory {
  @PrimaryGeneratedColumn("uuid") id!: string;

  @ManyToOne(
    _ => Exercise,
    exercise => exercise.exerciseHistory
  )
  exercise!: Exercise;

  @Column() exerciseId!: string;

  @ManyToOne(
    _ => Workout,
    workout => workout.exerciseHistory
  )
  workout!: Workout;

  @Column() workoutId!: string;

  @Column({ type: "jsonb" })
  executed!: any;
}
