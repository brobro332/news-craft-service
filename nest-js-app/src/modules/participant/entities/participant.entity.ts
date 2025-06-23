import { Answer } from 'src/modules/answer/entities/answer.entity';
import { QuizSession } from 'src/modules/quiz-session/entities/quiz-session.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['nickname', 'quizSession'])
export class Participant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  nickname: string;

  @ManyToOne(() => QuizSession, (quizSession) => quizSession.participants, {
    onDelete: 'CASCADE',
  })
  quizSession: QuizSession;

  @OneToMany(() => Answer, (answer) => answer.participant)
  answers: Answer[];

  @CreateDateColumn()
  joinedAt: Date;
}
