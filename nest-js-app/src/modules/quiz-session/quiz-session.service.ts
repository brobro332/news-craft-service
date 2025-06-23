import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizSession } from './entities/quiz-session.entity';
import { Quiz } from '../quiz/entities/quiz.entity';
import { Repository } from 'typeorm';
import { QuizSessionStatus } from './enums/quiz-session.enum';
import { QuizSessionGateway } from './quiz-session.gateway';
import { ScoreService } from '../score/score.service';

@Injectable()
export class QuizSessionService {
  private sessionTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor(
    @InjectRepository(QuizSession)
    private readonly repository: Repository<QuizSession>,
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    @Inject(forwardRef(() => QuizSessionGateway))
    private readonly gateway: QuizSessionGateway,
    private readonly scoreService: ScoreService,
  ) {}

  async createQuizSession(quizId: string): Promise<QuizSession> {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['questions'],
    });
    if (!quiz)
      throw new NotFoundException(`퀴즈 ID ${quizId}를 찾을 수 없습니다.`);

    const quizSession = this.repository.create({
      quiz,
      status: QuizSessionStatus.WAITING,
      perQuestionTime: 60,
      currentQuestionIndex: 0,
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

  async findQuizSessionByUrl(url: string): Promise<QuizSession> {
    const quizSession = await this.repository.findOne({
      where: { url },
      relations: ['quiz'],
    });

    if (!quizSession)
      throw new NotFoundException(`퀴즈세션 URL ${url}를 찾을 수 없습니다.`);
    return quizSession;
  }

  async startNextQuestion(id: string) {
    const quizSession = await this.repository.findOne({
      where: { id },
      relations: ['quiz'],
    });
    if (!quizSession) throw new NotFoundException();

    const quiz = await this.quizRepository.findOne({
      where: { id: quizSession.quiz.id },
      relations: ['questions'],
    });
    const totalQuestions = quiz?.questions.length ?? 0;

    if (
      quizSession.status === QuizSessionStatus.IN_PROGRESS &&
      quizSession.currentQuestionIndex >= 0
    ) {
      await this.broadcastResults(id);
      await new Promise((r) => setTimeout(r, 5000));
    }

    if (quizSession.status === QuizSessionStatus.WAITING) {
      quizSession.status = QuizSessionStatus.IN_PROGRESS;
      quizSession.currentQuestionIndex = 0;
    } else {
      quizSession.currentQuestionIndex += 1;
    }

    if (quizSession.currentQuestionIndex >= totalQuestions) {
      quizSession.status = QuizSessionStatus.FINISHED;
      quizSession.questionStartTime = null;
    } else {
      quizSession.questionStartTime = Date.now();
    }

    const saved = await this.repository.save(quizSession);

    this.gateway.server.to(id).emit('update', {
      currentQuestionIndex: saved.currentQuestionIndex,
      questionStartTime: saved.questionStartTime,
      perQuestionTime: saved.perQuestionTime,
      status: saved.status,
    });

    if (this.sessionTimers.has(id)) clearTimeout(this.sessionTimers.get(id));

    if (quizSession.status === QuizSessionStatus.IN_PROGRESS) {
      const timeout = setTimeout(() => {
        this.startNextQuestion(id);
      }, saved.perQuestionTime * 1000);

      this.sessionTimers.set(id, timeout);
    }

    return saved;
  }

  async broadcastResults(quizSessionId: string) {
    const quizSession = await this.findQuizSessionById(quizSessionId);
    if (!quizSession) return;

    const quiz = await this.quizRepository.findOne({
      where: { id: quizSession.quiz.id },
      relations: ['questions'],
    });

    const currentIndex = quizSession.currentQuestionIndex;
    if (currentIndex < 0 || !quiz || !quiz.questions[currentIndex]) {
      return;
    }

    const currentQuestion = quiz.questions[currentIndex];

    const scores =
      await this.scoreService.findScoresByQuizSessionId(quizSessionId);

    const rankings = scores
      .sort((a, b) => b.point - a.point)
      .map((score, idx) => ({
        nickname: score.participant.nickname,
        score: score.point,
        rank: idx + 1,
      }));

    this.gateway.server.to(quizSessionId).emit('questionResult', {
      correctAnswer: currentQuestion.answer,
      rankings,
    });
  }

  async getNicknamesBySessionId(sessionId: string): Promise<string[]> {
    const session = await this.repository.findOne({
      where: { id: sessionId },
      relations: ['participants'],
    });

    return session?.participants.map((p) => p.nickname) || [];
  }

  async endQuizSessionById(id: string) {
    const quizSession = await this.findQuizSessionById(id);
    if (!quizSession)
      throw new NotFoundException(`퀴즈세션 ID ${id}를 찾을 수 없습니다.`);
    quizSession.status = QuizSessionStatus.FINISHED;
    this.repository.save(quizSession);
  }
}
