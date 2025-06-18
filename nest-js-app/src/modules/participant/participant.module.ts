import { Module } from '@nestjs/common';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participant } from './entities/participant.entity';
import { QuizSession } from '../quiz-session/entities/quiz-session.entity';
import { Score } from '../score/entities/score.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Participant, QuizSession, Score])],
  controllers: [ParticipantController],
  providers: [ParticipantService],
})
export class ParticipantModule {}
