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

@Entity()
export class Workout {
  @PrimaryGeneratedColumn("uuid") id!: string;
  @Column({ nullable: true }) note?: string;

  @ManyToOne(_ => User)
  user!: User;

  @Column()
  userId!: string;

  @ManyToOne(_ => Trainer)
  trainer!: Trainer;

  @Column()
  trainerId!: string;

  @Column()
  startsAt: Date;

  @OneToMany(
    _ => ExerciseHistory,
    exerciseHistory => exerciseHistory.workout
  )
  exerciseHistory: ExerciseHistory[];
}
