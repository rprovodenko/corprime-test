import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Trade } from '../common/Trade';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/monitor-trade-price',
})
export class TradePriceMonitorGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.info(`TradePriceIngestGateway: client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.info(`TradePriceIngestGateway: client disconnected: ${client.id}`);
  }

  public emitNewLastSecondPrice(tradePrice: Trade) {
    this.server.emit('last-trade-price-per-sec-btc', tradePrice);
  }
  public emitNewLastMinutePrice(tradePrice: Trade) {
    this.server.emit('last-trade-price-per-min-btc', tradePrice);
  }
}
