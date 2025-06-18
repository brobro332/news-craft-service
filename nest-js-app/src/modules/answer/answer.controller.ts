import { Body, Controller, Param, Post } from '@nestjs/common';
import { AnswerService } from './answer.service';

@Controller()
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post('/questions/:questionId/answers/participants/:participantId')
  createAnswer(
    @Param('questionId') questionId: string,
    @Param('participantId') participantId: string,
    @Body() body: { selectedOption: string },
  ) {
    return this.answerService.createAnswer(
      participantId,
      questionId,
      body.selectedOption,
    );
  }
}
