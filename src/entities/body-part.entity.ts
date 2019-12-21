import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Assignment } from "./assignment.entity";

@Entity()
export class BodyPart {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Column()
  nameEn!: string;

  @Column()
  nameHu!: string;

  @ManyToMany(
    () => Assignment,
    assignment => assignment.bodyParts
  )
  assignments: Assignment[];
}
