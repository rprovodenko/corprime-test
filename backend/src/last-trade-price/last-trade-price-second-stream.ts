import { Trade } from '../common/Trade';
import { Transform } from 'stream';

export class LastTradePriceSecondStream extends Transform {
  private currentLatestTimestamp = null;
  private currentLastPriceForSecond = null;

  constructor() {
    super({ objectMode: true });
  }

  _transform(trade: Trade, _, callback) {
    console.log({ trade });
    try {
      if (this.currentLatestTimestamp === null) {
        this.currentLatestTimestamp = trade.timestamp;
        this.currentLastPriceForSecond = trade.price;
        return callback();
      }

      if (trade.timestamp < this.currentLatestTimestamp) {
        return callback();
      }

      if (this.isWithinCurrentUnit(trade.timestamp)) {
        this.currentLatestTimestamp = trade.timestamp;
        this.currentLastPriceForSecond = trade.price;
        return callback();
      }
      this.push({
        timestamp: this.currentLatestTimestamp,
        price: this.currentLastPriceForSecond,
      });

      this.currentLatestTimestamp = trade.timestamp;
      this.currentLastPriceForSecond = trade.price;
      return callback();
    } catch (e) {
      console.error(
        `Unknown error occured during transform. I'm preferring to die. ${e}`,
      );
      throw e;
    }
  }

  private isWithinCurrentUnit(timestamp: number) {
    const startOfSecond = new Date(this.currentLatestTimestamp);
    startOfSecond.setUTCMilliseconds(0);
    const endOfSecond = startOfSecond.getTime() + 999;
    return endOfSecond >= timestamp;
  }
}
