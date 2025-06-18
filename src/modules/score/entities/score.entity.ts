import { Participant } from 'src/modules/participant/entities/participant.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Score {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Participant, { onDelete: 'CASCADE' })
  @JoinColumn()
  participant: Participant;

  @Column({ default: 0 })
  point: number;
}
