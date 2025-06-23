import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Quiz } from '../quiz/entities/quiz.entity';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { UpdateQuestionDto } from './dtos/update-question.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question) private repository: Repository<Question>,
    @InjectRepository(Quiz) private quizRepository: Repository<Quiz>,
  ) {}

  async create(quizId: string, dto: CreateQuestionDto): Promise<Question> {
    const quiz = await this.quizRepository.findOneBy({ id: quizId });
    if (!quiz)
      throw new NotFoundException(`퀴즈 ID ${quizId}를 찾을 수 없습니다.`);

    const question = this.repository.create({ ...dto, quiz });
    return this.repository.save(question);
  }

  async findByQuizId(quizId: string, page: number, limit: number) {
    const [data, total] = await this.repository.findAndCount({
      where: { quiz: { id: quizId } },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'ASC' },
    });

    return { data, total };
  }

  async findById(id: string): Promise<Question> {
    const question = await this.repository.findOne({ where: { id } });
    if (!question)
      throw new NotFoundException(`문제 ID ${id}를 찾을 수 없습니다.`);
    return question;
  }

  async updateById(id: string, dto: UpdateQuestionDto) {
    const question = await this.findById(id);
    Object.assign(question, dto);
    return this.repository.save(question);
  }

  async removeById(id: string) {
    const question = await this.findById(id);
    await this.repository.remove(question);
  }
}
