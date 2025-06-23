import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Score } from './entities/score.entity';
import { Participant } from '../participant/entities/participant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Score)
    private readonly repository: Repository<Score>,
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
  ) {}

  async findScoreByPaticipantId(quizSessionId: string, participantId: string) {
    const score = await this.repository.findOne({
      where: {
        participant: { quizSession: { id: quizSessionId }, id: participantId },
      },
      relations: ['participant'],
    });

    if (!score)
      throw new NotFoundException(
        `참가자 ID ${participantId}의 점수를 찾을 수 없습니다.`,
      );

    return score;
  }

  async findScoresByQuizSessionId(quizSessionId: string) {
    return this.repository.find({
      relations: ['participant', 'participant.quizSession'],
      where: {
        participant: {
          quizSession: {
            id: quizSessionId,
          },
        },
      },
      order: {
        point: 'DESC',
      },
    });
  }
}
