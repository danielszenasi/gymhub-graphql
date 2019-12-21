import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  TableInheritance,
  ManyToMany,
  JoinTable
} from "typeorm";
import { User } from "./user.entity";
import { AssignmentHistory } from "./assignment-history.entity";
import { Category } from "./category.entity";
import { BodyPart } from "./body-part.entity";
import { Measure } from "./measure.entity";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class Assignment {
  @PrimaryGeneratedColumn("uuid") id!: string;

  @Column({ nullable: true }) nameEn!: string;

  @Column({ nullable: true }) nameHu!: string;

  @Column({ nullable: true }) descriptionEn?: string;

  @Column({ nullable: true }) descriptionHu?: string;

  @Column({ nullable: true }) url?: string;

  @ManyToMany(
    () => Measure,
    measure => measure.assignments
  )
  @JoinTable()
  measures: Measure[];

  @ManyToMany(
    () => Category,
    category => category.assignments
  )
  @JoinTable()
  categories: Category[];

  @ManyToMany(
    () => BodyPart,
    bodyPart => bodyPart.assignments
  )
  @JoinTable()
  bodyParts: BodyPart[];

  @ManyToOne(() => User)
  user!: User;

  @Column() userId!: string;

  @Column({ default: false })
  isPublic!: boolean;

  @OneToMany(
    () => AssignmentHistory,
    AssignmentHistory => AssignmentHistory.assignment
  )
  assignmentHistories!: AssignmentHistory[];
}
