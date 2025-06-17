import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizSession } from './entities/quiz-session.entity';
import { Quiz } from '../quiz/entities/quiz.entity';
import { Repository } from 'typeorm';
import { QuizSessionStatus } from './enums/quiz-session.enum';

@Injectable()
export class QuizSessionService {
  constructor(
    @InjectRepository(QuizSession)
    private readonly repository: Repository<QuizSession>,
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
  ) {}

  async createQuizSession(quizId: string): Promise<QuizSession> {
    const quiz = await this.quizRepository.findOneBy({ id: quizId });
    if (!quiz)
      throw new NotFoundException(`퀴즈 ID ${quizId}를 찾을 수 없습니다.`);

    const quizSession = this.repository.create({
      quiz,
      status: QuizSessionStatus.WAITING,
    });
    return this.repository.save(quizSession);
  }

  async findQuizSessionById(id: string): Promise<QuizSession> {
    const quizSession = await this.repository.findOne({
      where: { id },
      relations: ['quiz'],
    });

    if (!quizSession)
      throw new NotFoundException(`퀴즈세션 ID ${id}를 찾을 수 없습니다.`);
    return quizSession;
  }

  async updateQuizSessionStatusById(id: string, status: QuizSessionStatus) {
    const quizSession = await this.findQuizSessionById(id);
    if (!quizSession)
      throw new NotFoundException(`퀴즈세션 ID ${id}를 찾을 수 없습니다.`);
    quizSession.status = status;
    return this.repository.save(quizSession);
  }

  async deleteQuizSessionById(id: string) {
    const quizSession = await this.findQuizSessionById(id);
    if (!quizSession)
      throw new NotFoundException(`퀴즈세션 ID ${id}를 찾을 수 없습니다.`);
    this.repository.remove(quizSession);
  }
}
