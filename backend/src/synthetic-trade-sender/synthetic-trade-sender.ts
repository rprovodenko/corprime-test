import { io, Socket } from 'socket.io-client';
import { tradeGenerator } from './trade-generator';

export class SyntheticTradeSender {
  private ingestSocket: Socket = io(this.ingestUrl);
  private isSending = false;

  constructor(private ingestUrl: string) {}

  public async startSending() {
    this.isSending = true;
    await this.connect();

    for await (const trade of tradeGenerator()) {
      this.ingestSocket.emit('trade-price', trade);

      if (!this.isSending) {
        return;
      }
    }
  }

  private async connect() {
    await new Promise<void>((res, rej) => {
      this.ingestSocket.on('connect', () => {
        console.info(`SyntheticTradeSender is connected`);
        res();
      });
      this.ingestSocket.on('connect_error', (e) => {
        console.error(`SyntheticTradeSender connect_error: ${e}`);
        console.error(
          `SyntheticTradeSender will attempt to reconnect: ${this.ingestSocket.active}`,
        );
      });
      this.ingestSocket.on('disconnect', () => {
        console.info('SyntheticTradeSender disconnected');
      });
    });
  }

  public stopSending() {
    this.isSending = false;
  }

  public close() {
    this.ingestSocket.disconnect();
    this.ingestSocket.close();
  }
}
