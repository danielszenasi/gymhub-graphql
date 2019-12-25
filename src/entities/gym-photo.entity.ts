import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn
} from "typeorm";
import { Gym } from "./gym.entity";

@Entity()
export class GymPhoto {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column()
  public url!: string;

  @Index()
  @Column()
  public gymId!: string;

  @ManyToOne(
    () => Gym,
    gym => gym.photos
  )
  public gym!: Gym;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;

  @VersionColumn({ select: false })
  public version!: number;
}
