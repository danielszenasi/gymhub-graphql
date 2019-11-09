import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Exercise } from './exercise.entity';
import { Workout } from './workout.entity';

interface Executed {
  measure: 'mass' | 'length';
  value: number;
}

@Entity()
export class ExerciseHistory {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @ManyToOne(_ => Exercise)
  exercise!: Exercise;

  @Column() exerciseId!: string;

  @ManyToOne(_ => Workout, workout => workout.exercises)
  workout!: Workout;

  @Column() workoutId!: string;

  @Column({ type: 'jsonb' })
  executed!: Executed;
}
