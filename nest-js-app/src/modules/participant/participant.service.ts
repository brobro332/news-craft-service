import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Participant } from './entities/participant.entity';
import { QuizSession } from '../quiz-session/entities/quiz-session.entity';
import { Repository } from 'typeorm';
import { CreateParticipantDto } from './dtos/participatn.dto';
import { Score } from '../score/entities/score.entity';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectRepository(Participant)
    private readonly repository: Repository<Participant>,
    @InjectRepository(QuizSession)
    private readonly quizSessionRepository: Repository<QuizSession>,
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
  ) {}

  async createParticipant(quizSessionId: string, dto: CreateParticipantDto) {
    const quizSession = await this.quizSessionRepository.findOneBy({
      id: quizSessionId,
    });
    if (!quizSession)
      throw new NotFoundException(
        `퀴즈세션 ID ${quizSessionId}를 찾을 수 없습니다.`,
      );

    const participant = this.repository.create({
      userId: dto.userId,
      nickname: dto.nickname,
      quizSession,
    });
    const savedParticipant = await this.repository.save(participant);

    const score = this.scoreRepository.create({
      participant: savedParticipant,
      point: 0,
    });
    await this.scoreRepository.save(score);

    return savedParticipant;
  }

  async findByUserId(quizSessionId: string, userId: string) {
    return await this.repository.findOne({
      where: {
        userId: userId,
        quizSession: {
          id: quizSessionId,
        },
      },
    });
  }

  async findAllById(quizSessionId: string, page = 1, limit = 10) {
    const [data, total] = await this.repository.findAndCount({
      where: { quizSession: { id: quizSessionId } },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  async removeParticipantById(participantId: string) {
    const participant = await this.repository.findOne({
      where: { id: participantId },
    });

    if (!participant)
      throw new NotFoundException(
        `참가자 ID ${participant}를 찾을 수 없습니다.`,
      );

    await this.repository.remove(participant);
  }
}
