import { Controller, Get, Param } from '@nestjs/common';
import { ScoreService } from './score.service';

@Controller()
export class ScoreController {
  constructor(private readonly service: ScoreService) {}

  @Get('/quiz-sessions/:quizSessionId/participants/:participantId/score')
  findScoreByPaticipantId(
    @Param('quizSessionId') quizSessionId: string,
    @Param('participantId') participantId: string,
  ) {
    return this.service.findScoreByPaticipantId(quizSessionId, participantId);
  }

  @Get('/quiz-sessions/:quizSessionId/scores')
  findScoresByQuizSessionId(@Param('quizSessionId') quizSessionId: string) {
    return this.service.findScoresByQuizSessionId(quizSessionId);
  }
}
