import { Module } from '@nestjs/common';
import { QuizSessionController } from './quiz-session.controller';
import { QuizSessionService } from './quiz-session.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizSession } from './entities/quiz-session.entity';
import { Quiz } from '../quiz/entities/quiz.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuizSession, Quiz])],
  controllers: [QuizSessionController],
  providers: [QuizSessionService],
})
export class QuizSessionModule {}
