import { OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GuessService } from '../guess/guess.service';
export declare class LeaderboardGateway implements OnGatewayInit {
    private guessSvc;
    wss: Server;
    constructor(guessSvc: GuessService);
    afterInit(): void;
    handleJoin(client: Socket, payload: {
        date: string;
    }): Promise<void>;
}
