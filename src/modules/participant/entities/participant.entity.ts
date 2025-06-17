import { QuizSession } from 'src/modules/quiz-session/entities/quiz-session.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['nickname', 'quizSession'])
export class Participant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nickname: string;

  @ManyToOne(() => QuizSession, (quizSession) => quizSession.participants, {
    onDelete: 'CASCADE',
  })
  quizSession: QuizSession;

  @CreateDateColumn()
  joinedAt: Date;
}
