import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany
} from "typeorm";
import { Assignment } from "./assignment.entity";
import { Execution } from "./execution.entity";

@Entity()
export class Measure {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Column()
  nameEn!: string;

  @Column()
  nameHu!: string;

  @Column({ nullable: true })
  accurancy?: number;

  @ManyToMany(
    () => Assignment,
    assignment => assignment.measures
  )
  assignments: Assignment[];

  @OneToMany(
    () => Execution,
    execution => execution.measure
  )
  executions: Execution[];
}
