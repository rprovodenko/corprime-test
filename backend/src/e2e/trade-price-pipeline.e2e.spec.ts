import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';

jest.setTimeout(60000);
describe('Trade price pipeline', () => {
  let app: INestApplication;
  let ingestSocket: Socket;
  let monitorSocket: Socket;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(0);

    ingestSocket = io(`${await app.getUrl()}/ingest-trade-price`);
    await new Promise<void>((res, rej) => {
      ingestSocket.on('connect', () => {
        res();
      });
    });
    monitorSocket = io(`${await app.getUrl()}/monitor-trade-price`);
    await new Promise<void>((res, rej) => {
      monitorSocket.on('connect', () => {
        res();
      });
    });
  });
  afterEach(async () => {
    ingestSocket.disconnect();
    ingestSocket.close();
    await app.close();
  });

  it('should allow ingesting a trade price and then reading it', async () => {
    const p = new Promise((res, rej) => {
      monitorSocket.on('last-trade-price-per-sec-btc', res);
    });
    ingestSocket.emit('trade-price', {
      ticker: 'BTC',
      priceUsd: 109123.21,
      timestamp: new Date().getTime(),
    });
    const result = <any>await p;
    expect(result.timestamp).toEqual('...');
  });
});
