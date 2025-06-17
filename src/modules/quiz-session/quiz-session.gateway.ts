import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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

  @SubscribeMessage('join')
  handleJoinSession(
    @MessageBody() sessionId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(sessionId);
    client.emit('join', sessionId);
  }

  @SubscribeMessage('update-status')
  handleUpdateStatus(
    @MessageBody() data: { sessionId: string; status: string },
  ) {
    const { sessionId, status } = data;
    this.server.to(sessionId).emit('update-status', status);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    client.rooms.forEach((room) => {
      if (room !== client.id) {
        client.leave(room);
        this.server.to(room).emit('leave', client.id);
      }
    });
  }
}
