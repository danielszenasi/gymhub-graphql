import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn
} from "typeorm";
import { GymPhoto } from "./gym-photo.entity";
import { Assignment } from "./assignment.entity";

export interface ICoordinates {
  type: string;
  coordinates: number[];
}

@Entity()
export class Gym {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column({ nullable: true })
  public name?: string;

  @Column({ nullable: true })
  public streetAddress?: string;

  @Column({ nullable: true })
  public streetNumber?: string;

  @Column({ nullable: true })
  public city?: string;

  @Column({ nullable: true })
  public zipCode?: string;

  @Column({
    type: "geometry",
    nullable: true,
    spatialFeatureType: "Point",
    srid: 4326
  })
  public location?: ICoordinates;

  public get longitude() {
    return this.location.coordinates[0];
  }

  public get latitude() {
    return this.location.coordinates[1];
  }

  @OneToMany(
    () => GymPhoto,
    photo => photo.gym
  )
  public photos: GymPhoto[];

  @OneToMany(
    () => Assignment,
    assignment => assignment.gym
  )
  exercises: Assignment[];

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;

  @VersionColumn({ select: false })
  public version!: number;
}
