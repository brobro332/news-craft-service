import { Quiz } from 'src/modules/quiz/entities/quiz.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuizSessionStatus } from '../enums/quiz-session.enum';
import { nanoid } from 'nanoid';

@Entity()
export class QuizSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.sessions, { onDelete: 'CASCADE' })
  quiz: Quiz;

  @Column({
    type: 'enum',
    enum: QuizSessionStatus,
    default: QuizSessionStatus.WAITING,
  })
  status: QuizSessionStatus;

  @Column({ unique: true })
  url: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateUrl() {
    this.url = nanoid(8);
  }
}
