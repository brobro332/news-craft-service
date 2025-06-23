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

@Controller()
export class QuizSessionController {
  constructor(private readonly service: QuizSessionService) {}

  @Post('/quizzes/:quizId/quiz-sessions')
  createQuizSession(@Param('quizId') quizId: string) {
    return this.service.createQuizSession(quizId);
  }

  @Post('/quiz-sessions/:id')
  startNextQuestion(@Param('id') id: string) {
    return this.service.startNextQuestion(id);
  }

  @Get('/quiz-sessions/id/:id')
  findQuizSessionById(@Param('id') id: string) {
    return this.service.findQuizSessionById(id);
  }

  @Get('/quiz-sessions/url/:url')
  findQuizSessionByUrl(@Param('url') url: string) {
    return this.service.findQuizSessionByUrl(url);
  }

  @Delete('/quiz-sessions/:id')
  endQuizSessionById(@Param('id') id: string) {
    return this.service.endQuizSessionById(id);
  }
}
