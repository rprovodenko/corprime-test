import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { setTimeout } from 'timers/promises';
import { SyntheticTradeSender } from '../synthetic-trade-sender/synthetic-trade-sender';

jest.setTimeout(63000);
describe('Synthetic trade sender', () => {
  let app: INestApplication;
  let ingestSocket: Socket;
  let monitorSocket: Socket;
  let tradeSender: SyntheticTradeSender;

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

    tradeSender = new SyntheticTradeSender(
        `${await app.getUrl()}/ingest-trade-price`,
      );
  });
  afterEach(async () => {
    ingestSocket.disconnect();
    ingestSocket.close();

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
    expect(tradesPerMin.length).toBeGreaterThan(0);
  });
});
