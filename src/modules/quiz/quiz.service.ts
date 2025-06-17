import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { Repository } from 'typeorm';
import { CreatequizDto } from './dtos/create-quiz.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
  ) {}

  async create(dto: CreatequizDto): Promise<Quiz> {
    const quiz = this.quizRepository.create(dto);
    return await this.quizRepository.save(quiz);
  }

  async deleteById(id: string): Promise<void> {
    const quiz = await this.quizRepository.findOne({ where: { id } });
    if (!quiz) throw new NotFoundException(`퀴즈 ID ${id}를 찾을 수 없습니다.`);
    await this.quizRepository.remove(quiz);
  }
}
