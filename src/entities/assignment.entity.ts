import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ValueTransformer,
  OneToMany,
  TableInheritance
} from "typeorm";
import { User } from "./user.entity";
import { AssignmentHistory } from "./assignment-history.entity";

export type Measure =
  | "mass"
  | "length"
  | "area"
  | "volume"
  | "volume flow rate"
  | "temperature"
  | "time"
  | "frequency"
  | "speed"
  | "pace"
  | "pressure"
  | "digital"
  | "illuminance"
  | "parts-per"
  | "voltage"
  | "current"
  | "power"
  | "apparent power"
  | "reactive power"
  | "energy"
  | "reactive energy"
  | "angle"
  | "reps";

type Category = "barbell" | "dumbbell" | "machine" | "weighted bodyweight";
type BodyPart = "arms" | "back" | "legs";

function getTransformer(): ValueTransformer {
  return {
    // to db
    to(ams: string[]): any {
      const amsCollected = ams.reduce((amsObj, a) => {
        amsObj[a] = true;

        return amsObj;
      }, {});

      return amsCollected;
    },
    // from db
    from(amsCollected: object): string[] {
      return Object.keys(amsCollected);
    }
  };
}
@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class Assignment {
  @PrimaryGeneratedColumn("uuid") id!: string;

  @Column() name!: string;

  @Column({ nullable: true }) description?: string;

  @Column({ nullable: true }) url?: string;

  @Column({
    type: "jsonb",
    default: "{}",
    transformer: getTransformer()
  })
  measures!: Measure[];

  @Column({
    type: "jsonb",
    default: "{}",
    transformer: getTransformer()
  })
  categories!: Category[];

  @Column({
    type: "jsonb",
    default: "{}",
    transformer: getTransformer()
  })
  bodyParts!: BodyPart[];

  @ManyToOne(_ => User)
  user?: User;

  @Column({ nullable: true }) userId?: string;

  @OneToMany(
    _ => AssignmentHistory,
    AssignmentHistory => AssignmentHistory.assignment
  )
  assignmentHistory!: AssignmentHistory[];
}
