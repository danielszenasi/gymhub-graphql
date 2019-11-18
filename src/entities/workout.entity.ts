import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany
} from "typeorm";
import { User } from "./user.entity";
import { Trainer } from "./trainer.entity";
import { ExerciseHistory } from "./exercise-history.entity";

export enum WorkoutState {
  PLANNED = "PLANNED",
  FINISHED = "FINISHED"
}

@Entity()
export class Workout {
  @PrimaryGeneratedColumn("uuid") id!: string;

  @Column({ nullable: true }) name?: string;

  @Column({ nullable: true }) note?: string;

  @Column({
    type: "enum",
    enum: WorkoutState,
    default: WorkoutState.PLANNED
  })
  state: WorkoutState;

  @ManyToOne(_ => User)
  user!: User;

  @Column()
  userId!: string;

  @ManyToOne(_ => Trainer)
  trainer!: Trainer;

  @Column()
  trainerId!: string;

  @Column({ nullable: true })
  startsAt: Date;

  @OneToMany(
    _ => ExerciseHistory,
    exerciseHistory => exerciseHistory.workout
  )
  exerciseHistory: ExerciseHistory[];

  @ManyToOne(
    _ => Workout,
    workout => workout.children
  )
  parent: Workout;

  @OneToMany(
    _ => Workout,
    workout => workout.parent
  )
  children: Workout[];
}
