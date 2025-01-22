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

/**
 * Generates a trade every 0-9 ms of real time
 * Uses real time timestamps (simulates a real time scenario)
 */
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

/**
 * 10ms real time = 1 second synthetic time
 * UI will get data 100 times faster than with normal (real time) tradeGenerator
 */
export async function* tradeGeneratorSpeedrun() {
  let timeStep = 0;
  const startTimestamp = new Date('2015-01-22T16:53:30.774Z').getTime();
  while (true) {
    await setTimeout(5);
    const currentTimestamp = startTimestamp + timeStep * 500;
    const trade = generateTrade(currentTimestamp, timeStep);
    yield trade;

    timeStep++;
  }
}
