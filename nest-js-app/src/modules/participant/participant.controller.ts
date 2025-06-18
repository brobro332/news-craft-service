import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateParticipantDto } from './dtos/participatn.dto';
import { ParticipantService } from './participant.service';

@Controller()
export class ParticipantController {
  constructor(private readonly service: ParticipantService) {}

  @Post('/quiz-sessions/:quizSessionId/participants')
  createParticipant(
    @Param('quizSessionId') quizSessionId: string,
    @Body() dto: CreateParticipantDto,
  ) {
    return this.service.createParticipant(quizSessionId, dto);
  }

  @Get('/quiz-sessions/:quizSessionId/participants')
  findAllById(@Param('quizSessionId') quizSessionId: string) {
    return this.service.findAllById(quizSessionId);
  }
}
