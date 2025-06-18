import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { Repository } from 'typeorm';
import { Participant } from '../participant/entities/participant.entity';
import { Question } from '../question/entities/question.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly repository: Repository<Answer>,
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async createAnswer(
    participantId: string,
    questionId: string,
    selectedOption: string,
  ) {
    const participant = await this.participantRepository.findOneBy({
      id: participantId,
    });
    if (!participant)
      throw new NotFoundException(
        `참가자 ID ${participantId}를 찾을 수 없습니다.`,
      );

    const question = await this.questionRepository.findOneBy({
      id: questionId,
    });
    if (!question)
      throw new NotFoundException(`문제 ID ${questionId}를 찾을 수 없습니다.`);

    const answer = this.repository.create({
      participant,
      question,
      selectedOption,
    });
    return this.repository.save(answer);
  }
}
