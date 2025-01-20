import { Literal, Record, Number, Static } from 'runtypes';

export const Trade = Record({
  ticker: Literal('BTC'),
  price: Number,
  timestamp: Number,
});

export type Trade = Static<typeof Trade>;
