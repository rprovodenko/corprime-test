import { Trade } from '../../common/Trade';
import { Transform } from 'stream';

export class LastTradePriceStream extends Transform {
  private currentLatestTimestamp = null;
  private currentLastPrice = null;

  constructor(private window: 'second' | 'minute') {
    super({ objectMode: true });
  }

  _transform(trade: Trade, _, callback) {
    console.log({ trade });
    try {
      if (this.currentLatestTimestamp === null) {
        this.currentLatestTimestamp = trade.timestamp;
        this.currentLastPrice = trade.price;
        return callback();
      }

      if (trade.timestamp < this.currentLatestTimestamp) {
        return callback();
      }

      if (this.isWithinCurrentWindow(trade.timestamp)) {
        console.log('---herexxx');
        this.currentLatestTimestamp = trade.timestamp;
        this.currentLastPrice = trade.price;
        return callback();
      }

      this.push({
        timestamp: this.currentLatestTimestamp,
        price: this.currentLastPrice,
      });

      this.currentLatestTimestamp = trade.timestamp;
      this.currentLastPrice = trade.price;
      return callback();
    } catch (e) {
      console.error(
        `Unknown error occured during transform. I'm preferring to die. ${e}`,
      );
      throw e;
    }
  }

  private isWithinCurrentWindow(timestamp: number) {
    const endOfCurrentWindow =
      this.window === 'second'
        ? this.getEndOfCurrentSecond()
        : this.getEndOfCurrentMinute();
    console.log({ endOfCurrentWindow, timestamp });
    return endOfCurrentWindow >= timestamp;
  }

  private getEndOfCurrentSecond() {
    const endOfSecond = new Date(this.currentLatestTimestamp);
    endOfSecond.setUTCMilliseconds(999);
    return endOfSecond.getTime();
  }

  private getEndOfCurrentMinute() {
    const endOfMinute = new Date(this.currentLatestTimestamp);
    endOfMinute.setUTCSeconds(59);
    endOfMinute.setUTCMilliseconds(999);
    return endOfMinute.getTime();
  }
}
