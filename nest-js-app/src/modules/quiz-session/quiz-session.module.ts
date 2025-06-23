import { Module } from '@nestjs/common';
import { QuizSessionController } from './quiz-session.controller';
import { QuizSessionService } from './quiz-session.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizSession } from './entities/quiz-session.entity';
import { Quiz } from '../quiz/entities/quiz.entity';
import { QuizSessionGateway } from './quiz-session.gateway';
import { AnswerModule } from '../answer/answer.module';
import { ScoreModule } from '../score/score.module';
import { QuestionModule } from '../question/question.module';
import { ParticipantModule } from '../participant/participant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuizSession, Quiz]),
    AnswerModule,
    ScoreModule,
    QuestionModule,
    ParticipantModule,
  ],
  controllers: [QuizSessionController],
  providers: [QuizSessionService, QuizSessionGateway],
})
export class QuizSessionModule {}
