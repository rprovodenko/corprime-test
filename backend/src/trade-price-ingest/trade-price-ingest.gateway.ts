import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Trade } from '../common/Trade';
import { EventEmitter } from 'stream';

@WebSocketGateway({
  cors: {
    origin: '*', // TODO ?
  },
  namespace: '/ingest-trade-price',
})
export class TradePriceIngestGateway extends EventEmitter {
  @SubscribeMessage('trade-price')
  onNewMessage(@MessageBody() trade: unknown) {
    if (!Trade.guard(trade)) {
      return;
    }
    this.emit('trade-price', trade);
  }
}
