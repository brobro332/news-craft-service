import { Participant } from 'src/modules/participant/entities/participant.entity';
import { Question } from 'src/modules/question/entities/question.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Participant, (participant) => participant.answers, {
    onDelete: 'CASCADE',
  })
  participant: Participant;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  question: Question;

  @Column()
  selectedOption: string;

  @CreateDateColumn()
  createdAt: Date;
}
