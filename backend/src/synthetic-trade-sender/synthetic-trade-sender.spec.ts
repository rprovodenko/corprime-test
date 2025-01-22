import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { setTimeout } from 'timers/promises';
import { SyntheticTradeSender } from './synthetic-trade-sender';

jest.setTimeout(62000);
describe('Trade generator', () => {
  let app: INestApplication;
  let monitorSocket: Socket;
  let tradeSender: SyntheticTradeSender;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(0);

    monitorSocket = io(`${await app.getUrl()}/monitor-trade-price`);
    await new Promise<void>((res, rej) => {
      monitorSocket.on('connect', () => {
        res();
      });
    });

    tradeSender = new SyntheticTradeSender(
      `${await app.getUrl()}/ingest-trade-price`,
    );
  });

  afterEach(async () => {
    monitorSocket.disconnect();
    monitorSocket.close();
    tradeSender.stopSending();
    tradeSender.close();
    await app.close();
  });

  it('should continuously send plausible trades', async () => {
    const tradesPerSec = [];
    monitorSocket.on('last-trade-price-per-sec-btc', (t) =>
      tradesPerSec.push(t),
    );

    const tradesPerMin = [];
    monitorSocket.on('last-trade-price-per-min-btc', (t) =>
      tradesPerMin.push(t),
    );

    tradeSender.startSending();
    await setTimeout(61000);

    expect(tradesPerSec.length).toBeGreaterThan(60);
    expect(tradesPerMin.length).toEqual(1);
  });

  it('should support speedrun', async () => {
    const tradesPerSec = [];
    monitorSocket.on('last-trade-price-per-sec-btc', (t) =>
      tradesPerSec.push(t),
    );

    const tradesPerMin = [];
    monitorSocket.on('last-trade-price-per-min-btc', (t) =>
      tradesPerMin.push(t),
    );

    tradeSender.startSending(true);
    await setTimeout(10000);

    expect(tradesPerSec.length).toBeGreaterThan(150);
    expect(tradesPerMin.length).toBeGreaterThan(3);
  });
});
