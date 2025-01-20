import { LastTradePriceStream } from './last-trade-price-stream';
import { Readable } from 'stream';
import { Trade } from '../../common/Trade';
import { pipeline } from 'stream/promises';
import { TestSink } from './test-sink';

describe('LastTradePriceStream - seconds', () => {
  let lastPriceStream = new LastTradePriceStream('second');
  beforeEach(async () => {
    lastPriceStream = new LastTradePriceStream('second');
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
    ]);
    const sink = new TestSink();
    await pipeline(dataStream, lastPriceStream, sink);
    expect(sink.result).toMatchInlineSnapshot(`
      [
        {
          "price": 1,
          "timestamp": 1737390304852,
        },
      ]
    `);
  });

  it('should return one trade price - scenario with multiple trades for the same second', async () => {
    const dataStream = Readable.from(<Trade[]>[
      {
        ticker: 'BTC',
        price: 1,
        timestamp: new Date('2025-01-20T16:25:04.152Z').getTime(),
      },
      {
        ticker: 'BTC',
        price: 0.5,
        timestamp: new Date('2025-01-20T16:25:04.352Z').getTime(),
      },
      {
        ticker: 'BTC',
        price: 4,
        timestamp: new Date('2025-01-20T16:25:04.452Z').getTime(),
      },
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
    ]);
    const sink = new TestSink();
    await pipeline(dataStream, lastPriceStream, sink);
    expect(sink.result).toMatchInlineSnapshot(`
      [
        {
          "price": 1,
          "timestamp": 1737390304852,
        },
      ]
    `);
  });

  it('should return two trade prices - for two seconds', async () => {
    const dataStream = Readable.from(<Trade[]>[
      {
        ticker: 'BTC',
        price: 1,
        timestamp: new Date('2025-01-20T16:25:04.152Z').getTime(),
      },
      {
        ticker: 'BTC',
        price: 1,
        timestamp: new Date('2025-01-20T16:25:04.852Z').getTime(),
      },
      {
        ticker: 'BTC',
        price: 6,
        timestamp: new Date('2025-01-20T16:25:05.252Z').getTime(),
      },
      {
        ticker: 'BTC',
        price: 2,
        timestamp: new Date('2025-01-20T16:25:05.552Z').getTime(),
      },
      {
        ticker: 'BTC',
        price: 2,
        timestamp: new Date('2025-01-20T16:25:06.852Z').getTime(),
      },
    ]);
    const sink = new TestSink();
    await pipeline(dataStream, lastPriceStream, sink);
    expect(sink.result).toMatchInlineSnapshot(`
      [
        {
          "price": 1,
          "timestamp": 1737390304852,
        },
        {
          "price": 2,
          "timestamp": 1737390305552,
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
        timestamp: new Date('2025-01-20T16:25:05.252Z').getTime(),
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

  it('should tolerate a gap in seconds', async () => {
    const dataStream = Readable.from(<Trade[]>[
      {
        ticker: 'BTC',
        price: 6,
        timestamp: new Date('2025-01-20T16:25:02.952Z').getTime(),
      },
      {
        ticker: 'BTC',
        price: 1,
        timestamp: new Date('2025-01-20T16:25:04.852Z').getTime(),
      },
      {
        ticker: 'BTC',
        price: 8,
        timestamp: new Date('2025-01-20T16:25:05.252Z').getTime(),
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
          "timestamp": 1737390304852,
        },
      ]
    `);
  });
});
