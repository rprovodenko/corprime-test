import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Adjust the origin for your use case
  },
  namespace: '/ingest-trade-price',
})
export class TradePriceIngestGateway implements OnGatewayConnection {
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

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any) {
    console.log(body);
    this.server.emit('onMessage', {
      msg: 'New Message',
      content: body,
    });
  }
}
