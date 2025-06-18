import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { UpdateQuestionDto } from './dtos/update-question.dto';
import { CreateQuestionDto } from './dtos/create-question.dto';

@Controller()
export class QuestionController {
  constructor(private readonly service: QuestionService) {}

  @Post('/quizzes/:quizId/questions')
  create(@Param('quizId') quizId: string, @Body() dto: CreateQuestionDto) {
    return this.service.create(quizId, dto);
  }

  @Get('/quizzes/:quizId/questions')
  findByQuizId(
    @Param('quizId') quizId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.service.findByQuizId(quizId, page, limit);
  }

  @Get('/questions/:id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch('/questions/:id')
  updateById(@Param('id') id: string, @Body() dto: UpdateQuestionDto) {
    return this.service.updateById(id, dto);
  }

  @Delete('/questions/:id')
  removeById(@Param('id') id: string) {
    return this.service.removeById(id);
  }
}
