import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { EventEmitter } from 'stream';

@WebSocketGateway({
  cors: {
    origin: '*', // Adjust the origin for your use case
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

  @SubscribeMessage('trade-price')
  onNewMessage(@MessageBody() body: any) {
    console.log(body);
    // TODO: validate
    this.emit('trade-price', body);
  }
}
