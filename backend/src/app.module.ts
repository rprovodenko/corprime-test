import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TradePriceIngestGateway } from './trade-price-ingest/trade-price-ingest.gateway';
import { TradePriceMonitorGateway } from './trade-price-monitor/trade-price-monitor.gateway';
import { TradePricePipeBridgeService } from './trade-price-pipe-bridge/trade-price-pipe-bridge.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    AppService,
    TradePriceIngestGateway,
    TradePriceMonitorGateway,
    TradePricePipeBridgeService,
  ],
})
export class AppModule {}
