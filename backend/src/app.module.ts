import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TradePriceIngestGateway } from './trade-price-ingest/trade-price-ingest.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, TradePriceIngestGateway],
})
export class AppModule {}
