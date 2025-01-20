import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Trade } from '../common/Trade';

@WebSocketGateway({
  cors: {
    origin: '*', // Adjust the origin for your use case
  },
  namespace: '/monitor-trade-price',
})
export class TradePriceMonitorGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {});
  }
  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.server.sockets;
  }

  public emitNewLastSecondPrice(tradePrice: Trade) {
    this.server.emit('last-trade-price-per-sec-btc', tradePrice);
  }
  public emitNewLastMinutePrice(tradePrice: Trade) {
    this.server.emit('last-trade-price-per-min-btc', tradePrice);
  }
}
