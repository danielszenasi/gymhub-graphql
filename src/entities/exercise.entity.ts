import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ValueTransformer } from 'typeorm';
import { User } from './user.entity';

type Measure = 'mass' | 'length';
type Category = 'barbell' | 'bumbbell' | 'machine' | 'weighted bodyweight';
type BodyPart = 'arms' | 'back' | 'legs';

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
export class Exercise {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @Column() name!: string;

  @Column() instructions!: string;

  @Column() url!: string;

  @Column({
    type: 'jsonb',
    default: '{}',
    transformer: getTransformer()
  })
  measures!: Measure[];

  @Column({
    type: 'jsonb',
    default: '{}',
    transformer: getTransformer()
  })
  categories!: Category[];

  @Column({
    type: 'jsonb',
    default: '{}',
    transformer: getTransformer()
  })
  bodyParts!: BodyPart[];

  @ManyToOne(_ => User)
  user?: User;

  @Column({ nullable: true }) userId?: string;
}
