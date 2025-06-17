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

  @Post('/quizzes/:quizId/quiz-sessions')
  createQuizSession(@Param('quizId') quizId: string) {
    return this.service.createQuizSession(quizId);
  }

  @Get('/quiz-sessions/:id')
  findQuizSessionById(@Param('id') id: string) {
    return this.service.findQuizSessionById(id);
  }

  @Patch('/quiz-sessions/:id/status')
  updateQuizSessionStatusById(
    @Param('id') id: string,
    @Body('status') status: QuizSessionStatus,
  ) {
    return this.service.updateQuizSessionStatusById(id, status);
  }

  @Delete('/quiz-sessions/:id')
  endQuizSessionById(@Param('id') id: string) {
    return this.service.endQuizSessionById(id);
  }
}
