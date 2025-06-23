import { Module } from '@nestjs/common';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { Participant } from '../participant/entities/participant.entity';
import { Question } from '../question/entities/question.entity';
import { Score } from '../score/entities/score.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Answer, Participant, Question, Score])],
  controllers: [AnswerController],
  providers: [AnswerService],
  exports: [AnswerService],
})
export class AnswerModule {}
