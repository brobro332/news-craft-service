import { Module } from '@nestjs/common';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participant } from './entities/participant.entity';
import { QuizSession } from '../quiz-session/entities/quiz-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Participant, QuizSession])],
  controllers: [ParticipantController],
  providers: [ParticipantService],
})
export class ParticipantModule {}
