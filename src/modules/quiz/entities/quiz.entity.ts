import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuizStatus } from '../enums/quiz-status.enum';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
