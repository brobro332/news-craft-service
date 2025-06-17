import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreatequizDto } from './dtos/create-quiz.dto';
import { Quiz } from './entities/quiz.entity';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  create(@Body() dto: CreatequizDto): Promise<Quiz> {
    return this.quizService.create(dto);
  }

  @Delete(':id')
  deleteById(@Param('id') id: string): Promise<void> {
    return this.quizService.deleteById(id);
  }
}
