import { Quiz } from 'src/modules/quiz/entities/quiz.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuizSessionStatus } from '../enums/quiz-session.enum';
import { nanoid } from 'nanoid';
import { Participant } from 'src/modules/participant/entities/participant.entity';

@Entity()
export class QuizSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.quizSessions, { onDelete: 'CASCADE' })
  quiz: Quiz;

  @Column({
    type: 'enum',
    enum: QuizSessionStatus,
    default: QuizSessionStatus.WAITING,
  })
  status: QuizSessionStatus;

  @Column({ unique: true })
  url: string;

  @Column({ type: 'bigint', nullable: true })
  questionStartTime: number | null;

  @Column({ type: 'int', default: 60 })
  perQuestionTime: number;

  @Column({ type: 'int', default: 0 })
  currentQuestionIndex: number;

  @OneToMany(() => Participant, (participant) => participant.quizSession, {
    cascade: true,
  })
  participants: Participant[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateUrl() {
    this.url = nanoid(8);
  }
}
