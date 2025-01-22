import { Trade } from '../common/Trade';
import { setTimeout } from 'timers/promises';
import { generateNextPrice } from './generate-next-price';

// between 0 and 9 ms
function generateTimeGapMs() {
  return Math.floor(Math.random() * 10);
}

function generateTrade(timestamp: number, timeStep: number): Trade {
  return {
    ticker: 'BTC',
    price: generateNextPrice(timeStep, 100000, 20000),
    timestamp: timestamp,
  };
}

export async function* tradeGenerator() {
  let timeStep = 0;
  while (true) {
    const timeGap = generateTimeGapMs();
    await setTimeout(timeGap);
    const currentTimestamp = new Date().getTime();

    const trade = generateTrade(currentTimestamp, timeStep);
    yield trade;

    timeStep++;
  }
}
