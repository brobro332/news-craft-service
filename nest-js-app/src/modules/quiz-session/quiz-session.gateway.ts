import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { forwardRef, Inject } from '@nestjs/common';
import { QuizSessionService } from './quiz-session.service';
import { AnswerService } from '../answer/answer.service';
import { ParticipantService } from '../participant/participant.service';
@WebSocketGateway({
  namespace: '/quiz-sessions',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class QuizSessionGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private socketToParticipant = new Map<
    string,
    { participantId: string; sessionId: string }
  >();

  constructor(
    @Inject(forwardRef(() => QuizSessionService))
    private readonly service: QuizSessionService,
    private readonly answerService: AnswerService,
    private readonly participantService: ParticipantService,
  ) {}

  @SubscribeMessage('join')
  async handleJoinSession(
    @MessageBody() data: { sessionId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { sessionId, userId } = data;

    const participant = await this.participantService.findByUserId(
      sessionId,
      userId,
    );

    if (!participant) {
      client.emit('error', '참가자 정보가 존재하지 않습니다.');
      return;
    }

    client.join(sessionId);
    this.socketToParticipant.set(client.id, {
      participantId: participant.id,
      sessionId,
    });

    const quizSession = await this.service.findQuizSessionById(sessionId);
    if (!quizSession) {
      client.emit('error', '세션이 존재하지 않습니다.');
      return;
    }

    const nicknames = await this.service.getNicknamesBySessionId(sessionId);
    this.server.to(sessionId).emit('participants', nicknames);

    switch (quizSession.status) {
      case 'waiting':
        client.emit('session-waiting', {
          message: '퀴즈가 아직 시작되지 않았습니다.',
        });
        break;
      case 'in_progress':
        client.emit('session-in-progress', {
          currentQuestionIndex: quizSession.currentQuestionIndex,
          perQuestionTime: quizSession.perQuestionTime,
          questionStartTime: quizSession.questionStartTime,
        });
        break;
      case 'finished':
        client.emit('session-finished', {
          message: '퀴즈가 종료되었습니다.',
        });
        break;
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const mapping = this.socketToParticipant.get(client.id);
    if (!mapping) return;

    const { participantId, sessionId } = mapping;

    client.leave(sessionId);

    //await this.participantService.removeParticipantById(participantId);

    const nicknames = await this.service.getNicknamesBySessionId(sessionId);
    this.server.to(sessionId).emit('participants', nicknames);

    this.socketToParticipant.delete(client.id);
  }

  @SubscribeMessage('submit')
  async handleAnswer(
    @MessageBody()
    data: {
      quizSessionId: string;
      participantId: string;
      questionId: string;
      selectedOption: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { quizSessionId, questionId, participantId, selectedOption } = data;

    await this.answerService.createAnswer(
      participantId,
      questionId,
      selectedOption,
    );

    const answers = await this.answerService.getAnswersCount(
      quizSessionId,
      questionId,
    );

    this.server.to(quizSessionId).emit('answers', answers);
  }
}
