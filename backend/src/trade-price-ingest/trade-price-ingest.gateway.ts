import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Trade } from '../common/Trade';
import { EventEmitter } from 'stream';
import { Socket } from 'socket.io-client';

@WebSocketGateway({
  cors: {
    origin: '*', // TODO ?
  },
  namespace: '/ingest-trade-price',
})
export class TradePriceIngestGateway
  extends EventEmitter
  implements OnGatewayConnection, OnGatewayDisconnect
{
  handleConnection(client: Socket) {
    console.info(`TradePriceIngestGateway: client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.info(`TradePriceIngestGateway: client disconnected: ${client.id}`);
  }

  @SubscribeMessage('trade-price')
  onNewMessage(@MessageBody() trade: unknown) {
    if (!Trade.guard(trade)) {
      return;
    }
    this.emit('trade-price', trade);
  }
}
