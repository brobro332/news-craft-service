import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuizStatus } from '../enums/quiz-status.enum';
import { Question } from 'src/modules/question/entities/question.entity';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: String;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: QuizStatus,
    default: QuizStatus.Draft,
  })
  status: QuizStatus;

  @OneToMany(() => Question, (question) => question.quiz, { cascade: true })
  questions: Question[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
