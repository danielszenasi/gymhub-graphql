import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  ValueTransformer
} from "typeorm";
import { Exercise } from "./exercise.entity";
import { Workout } from "./workout.entity";

const defaultMeasures = {
  mass: "kg",
  time: "s",
  length: "m"
};
enum Measure {
  mass = "mass",
  length = "length",
  time = "time"
}
function getTransformer(): ValueTransformer {
  return {
    // to db
    to(json: any): any {
      return json;
    },
    // from db
    from(
      json: Record<Measure, number>
    ): { [key: string]: { unit: string; quantity: number } }[] {
      return Object.keys(json).map(key => {
        return { [key]: { quantity: json[key], unit: defaultMeasures[key] } };
      });
    }
  };
}

@Entity()
export class ExerciseHistory {
  @PrimaryGeneratedColumn("uuid") id!: string;

  @ManyToOne(_ => Exercise)
  exercise!: Exercise;

  @Column() exerciseId!: string;

  @ManyToOne(
    _ => Workout,
    workout => workout.exerciseHistory
  )
  workout!: Workout;

  @Column() workoutId!: string;

  @Column({ type: "jsonb", transformer: getTransformer() })
  executed!: any;
}
