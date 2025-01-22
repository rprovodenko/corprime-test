import { Injectable } from '@nestjs/common';
import { TradePriceIngestGateway } from '../trade-price-ingest/trade-price-ingest.gateway';
import { TradePriceMonitorGateway } from '../trade-price-monitor/trade-price-monitor.gateway';
import { Trade } from '../common/Trade';
import { LastTradePriceStream } from './last-price-stream/last-trade-price-stream';

@Injectable()
export class TradePricePipeBridgeService {
  private lastPriceSecondsStream = new LastTradePriceStream('second');
  private lastPriceMinutesStream = new LastTradePriceStream('minute');

  constructor(
    private readonly ingestGateway: TradePriceIngestGateway,
    private readonly monitorGateway: TradePriceMonitorGateway,
  ) {
    this.ingestGateway.on('trade-price', (trade) =>
      this.handleNewTradePrice(trade),
    );
    void this.pushLastTradeSecondsToMonitor();
    void this.pushLastTradeMinutesToMonitor();
  }

  private handleNewTradePrice(trade: Trade) {
    // TODO: cb?
    this.lastPriceSecondsStream.write(trade);
    this.lastPriceMinutesStream.write(trade);
  }

  private async pushLastTradeSecondsToMonitor() {
    for await (const trade of this.lastPriceSecondsStream) {
      this.monitorGateway.emitNewLastSecondPrice(trade);
    }
  }
  private async pushLastTradeMinutesToMonitor() {
    for await (const trade of this.lastPriceMinutesStream) {
      this.monitorGateway.emitNewLastMinutePrice(trade);
    }
  }
}
