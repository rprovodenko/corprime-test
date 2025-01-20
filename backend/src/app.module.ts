import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TradePriceIngestGateway } from './trade-price-ingest/trade-price-ingest.gateway';
import { TradePriceMonitorGateway } from './trade-price-monitor/trade-price-monitor.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, TradePriceIngestGateway, TradePriceMonitorGateway],
})
export class AppModule {}
