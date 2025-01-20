import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Trade } from '../common/Trade';

@WebSocketGateway({
  cors: {
    origin: '*', // Adjust the origin for your use case
  },
  namespace: '/monitor-trade-price',
})
export class TradePriceMonitorGateway {
  @WebSocketServer()
  server: Server;

  public emitNewLastSecondPrice(tradePrice: Trade) {
    this.server.emit('last-trade-price-per-sec-btc', tradePrice);
  }
  public emitNewLastMinutePrice(tradePrice: Trade) {
    this.server.emit('last-trade-price-per-min-btc', tradePrice);
  }
}
