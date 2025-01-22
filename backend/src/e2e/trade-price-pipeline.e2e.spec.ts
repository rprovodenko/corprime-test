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
    monitorSocket.disconnect();
    monitorSocket.close();
    await app.close();
  });

  it('should allow ingesting a trade price and then reading it - seconds and minutes', async () => {
    const lastTradeSecPromise = new Promise((res, rej) => {
      monitorSocket.on('last-trade-price-per-sec-btc', res);
    });
    const lastTradeMinPromise = new Promise((res, rej) => {
      monitorSocket.on('last-trade-price-per-min-btc', res);
    });
    ingestSocket.emit('trade-price', {
      ticker: 'BTC',
      price: 1,
      timestamp: new Date('2025-01-20T16:25:04.952Z').getTime(),
    });
    ingestSocket.emit('trade-price', {
      ticker: 'BTC',
      price: 2,
      timestamp: new Date('2025-01-20T16:27:04.952Z').getTime(),
    });
    const lastTradeSec = <any>await lastTradeSecPromise;
    expect(lastTradeSec).toMatchInlineSnapshot(`
      {
        "price": 1,
        "timestamp": 1737390304952,
      }
    `);

    const lastTradeMin = <any>await lastTradeMinPromise;
    expect(lastTradeMin).toMatchInlineSnapshot(`
      {
        "price": 1,
        "timestamp": 1737390304952,
      }
    `);
  });
});
