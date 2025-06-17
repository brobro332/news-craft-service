import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { QuizSessionService } from './quiz-session.service';
import { QuizSessionStatus } from './enums/quiz-session.enum';

@Controller()
export class QuizSessionController {
  constructor(private readonly service: QuizSessionService) {}

  @Post('/quizzes/:quizId/quiz-session')
  createQuizSession(@Param('quizId') quizId: string) {
    return this.service.createQuizSession(quizId);
  }

  @Get('/quiz-session/:id')
  findQuizSessionById(@Param('id') id: string) {
    return this.service.findQuizSessionById(id);
  }

  @Patch('/quiz-session/:id/status')
  updateQuizSessionStatusById(
    @Param('id') id: string,
    @Body('status') status: QuizSessionStatus,
  ) {
    return this.service.updateQuizSessionStatusById(id, status);
  }

  @Delete('/quiz-session/:id')
  deleteQuizSessionById(@Param('id') id: string) {
    return this.service.deleteQuizSessionById(id);
  }
}
