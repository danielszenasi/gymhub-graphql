import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne
} from "typeorm";

import { Trainer } from "./trainer.entity";
import { WorkoutPlan } from "./workout-plan.entity";

export enum System {
  METRIC = "metric",
  IMPERIAL = "imperial"
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid") id!: string;

  @Column() email!: string;

  @Column() password!: string;

  @Column({ nullable: true }) firstName!: string;

  @Column({ nullable: true }) lastName!: string;

  @Column({ nullable: true }) profileImageUrl?: string;

  @Column({ nullable: true })
  inviteToken!: string;

  @Column({ default: true })
  inviteAccepted!: boolean;

  @Column({ default: true })
  emailConfirmed!: boolean;

  @Column({ nullable: true })
  emailConfirmToken!: string;

  @Column({ nullable: true })
  resetToken!: string;

  @Column({ nullable: true })
  resetExpires!: Date;

  @Column({ nullable: true })
  deletedAt!: Date;

  @Column({ nullable: true })
  lastLogin!: Date;

  @OneToOne(() => Trainer)
  @JoinColumn()
  trainerProfile?: Trainer;

  @Column({ nullable: true })
  public trainerProfileId?: string;

  @ManyToOne(() => Trainer)
  trainer!: Trainer;

  @Column({ nullable: true })
  public trainerId?: string;

  @CreateDateColumn()
  joinedAt!: Date;

  @Column({ default: false })
  isSuper!: boolean;

  @Column({
    type: "enum",
    enum: System,
    default: System.IMPERIAL
  })
  measureSystem: System;

  @ManyToOne(() => WorkoutPlan)
  workoutPlan!: WorkoutPlan;

  @Column({ nullable: true })
  public workoutPlanId?: string;
}
