import { Module } from '@nestjs/common';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { Participant } from '../participant/entities/participant.entity';
import { Question } from '../question/entities/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Answer, Participant, Question])],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AnswerModule {}
