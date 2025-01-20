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
    console.log('----herexxx');
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Connected');
    });
  }
  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.server.sockets;

    console.log(sockets);
  }

  public emitNewLastSecondPrice(tradePrice: Trade) {
    this.server.emit('onMessage', {
      msg: 'last-trade-price-per-sec-btc',
      content: tradePrice,
    });
  }
  public emitNewLastMinutePrice(tradePrice: Trade) {
    this.server.emit('onMessage', {
      msg: 'last-trade-price-per-min-btc',
      content: tradePrice,
    });
  }
}
