import { io, Socket } from 'socket.io-client';
import { tradeGenerator, tradeGeneratorSpeedrun } from './trade-generator';

export class SyntheticTradeSender {
  private ingestSocket: Socket = io(this.ingestUrl);
  private isSending = false;

  constructor(private ingestUrl: string) {}

  public async startSending(speedrun = false) {
    this.isSending = true;
    await this.connect();
    const tradeGen = !speedrun ? tradeGenerator : tradeGeneratorSpeedrun;

    for await (const trade of tradeGen()) {
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
