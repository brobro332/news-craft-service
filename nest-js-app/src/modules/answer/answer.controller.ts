import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AnswerService } from './answer.service';

@Controller()
export class AnswerController {
  constructor(private readonly service: AnswerService) {}

  @Post('/questions/:questionId/answers/participants/:participantId')
  createAnswer(
    @Param('questionId') questionId: string,
    @Param('participantId') participantId: string,
    @Body() body: { selectedOption: string },
  ) {
    return this.service.createAnswer(
      participantId,
      questionId,
      body.selectedOption,
    );
  }
}
