import {
  WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GuessService } from '../guess/guess.service';

@WebSocketGateway({ namespace: '/leaderboard' })
export class LeaderboardGateway implements OnGatewayInit {
  @WebSocketServer() wss: Server;
  constructor(private guessSvc: GuessService) {}

  afterInit() {
    // Rien à faire
  }

  @SubscribeMessage('join')
  async handleJoin(client: Socket, payload: { date: string }) {
    client.join(payload.date);
    const top = await this.guessSvc.getLeaderboard(payload.date);
    client.emit('updateLeaderboard', top);
  }
}
