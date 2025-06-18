import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { Repository } from 'typeorm';
import { Participant } from '../participant/entities/participant.entity';
import { Question } from '../question/entities/question.entity';
import { Score } from '../score/entities/score.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly repository: Repository<Answer>,
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
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

    let score = await this.scoreRepository.findOne({
      where: { participant: { id: participantId } },
    });
    if (!score) {
      score = this.scoreRepository.create({ participant, point: 0 });
      await this.scoreRepository.save(score);
    }

    const answer = this.repository.create({
      participant,
      question,
      selectedOption,
    });

    if (selectedOption === question.answer)
      await this.scoreRepository.increment(
        { participant: { id: participantId } },
        'point',
        1,
      );

    return this.repository.save(answer);
  }
}
