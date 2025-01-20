import { LastTradePriceStream } from './last-trade-price-stream';
import { Readable } from 'stream';
import { Trade } from '../../common/Trade';
import { pipeline } from 'stream/promises';
import { TestSink } from './test-sink';

describe('LastTradePriceStream - minutes', () => {
  let lastPriceStream = new LastTradePriceStream('minute');
  beforeEach(async () => {
    lastPriceStream = new LastTradePriceStream('minute');
  });

  it('should return one trade price', async () => {
    const dataStream = Readable.from(<Trade[]>[
      {
        ticker: 'BTC',
        price: 1,
        timestamp: new Date('2025-01-20T16:25:04.852Z').getTime(),
      },
      {
        ticker: 'BTC',
        price: 2,
        timestamp: new Date('2025-01-20T16:25:05.852Z').getTime(),
      },
      {
        ticker: 'BTC',
        price: 3,
        timestamp: new Date('2025-01-20T16:26:05.852Z').getTime(),
      },
    ]);
    const sink = new TestSink();
    await pipeline(dataStream, lastPriceStream, sink);
    expect(sink.result).toMatchInlineSnapshot(`
      [
        {
          "price": 2,
          "timestamp": 1737390305852,
        },
      ]
    `);
  });

  it('should return two trade prices - for two minutes', async () => {
    const dataStream = Readable.from(<Trade[]>[
      {
        ticker: 'BTC',
        price: 1,
        timestamp: new Date('2025-01-20T16:25:04.152Z').getTime(),
      },
      {
        ticker: 'BTC',
        price: 6,
        timestamp: new Date('2025-01-20T16:26:05.252Z').getTime(),
      },
      {
        ticker: 'BTC',
        price: 2,
        timestamp: new Date('2025-01-20T16:27:06.852Z').getTime(),
      },
    ]);
    const sink = new TestSink();
    await pipeline(dataStream, lastPriceStream, sink);
    expect(sink.result).toMatchInlineSnapshot(`
      [
        {
          "price": 1,
          "timestamp": 1737390304152,
        },
        {
          "price": 6,
          "timestamp": 1737390365252,
        },
      ]
    `);
  });

  it('should ignore older record', async () => {
    const dataStream = Readable.from(<Trade[]>[
      {
        ticker: 'BTC',
        price: 6,
        timestamp: new Date('2025-01-20T16:25:04.952Z').getTime(),
      },
      {
        ticker: 'BTC',
        price: 1,
        timestamp: new Date('2025-01-20T16:25:04.852Z').getTime(),
      },
      {
        ticker: 'BTC',
        price: 8,
        timestamp: new Date('2025-01-20T16:25:03.252Z').getTime(),
      },
      {
        ticker: 'BTC',
        price: 10,
        timestamp: new Date('2025-01-20T16:26:05.252Z').getTime(),
      },
    ]);
    const sink = new TestSink();
    await pipeline(dataStream, lastPriceStream, sink);
    expect(sink.result).toMatchInlineSnapshot(`
      [
        {
          "price": 6,
          "timestamp": 1737390304952,
        },
      ]
    `);
  });

  it('should tolerate a gap in minutes', async () => {
    const dataStream = Readable.from(<Trade[]>[
      {
        ticker: 'BTC',
        price: 6,
        timestamp: new Date('2025-01-20T16:25:02.952Z').getTime(),
      },
      {
        ticker: 'BTC',
        price: 1,
        timestamp: new Date('2025-01-20T16:28:04.852Z').getTime(),
      },
      {
        ticker: 'BTC',
        price: 8,
        timestamp: new Date('2025-01-20T16:30:05.252Z').getTime(),
      },
    ]);
    const sink = new TestSink();
    await pipeline(dataStream, lastPriceStream, sink);
    expect(sink.result).toMatchInlineSnapshot(`
      [
        {
          "price": 6,
          "timestamp": 1737390302952,
        },
        {
          "price": 1,
          "timestamp": 1737390484852,
        },
      ]
    `);
  });
});
