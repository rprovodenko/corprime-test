import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Trade } from '../common/Trade';
import { EventEmitter } from 'stream';

@WebSocketGateway({
  cors: {
    origin: '*', // TODO ?
  },
  namespace: '/ingest-trade-price',
})
export class TradePriceIngestGateway
  extends EventEmitter
  implements OnGatewayConnection
{
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {});
  }
  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.server.sockets;
  }

  @SubscribeMessage('trade-price')
  onNewMessage(@MessageBody() trade: unknown) {
    if (!Trade.guard(trade)) {
      return;
    }
    this.emit('trade-price', trade);
  }
}
