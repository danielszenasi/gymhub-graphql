import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Trainer {
  @PrimaryGeneratedColumn('uuid') id!: string;
}
