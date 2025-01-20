import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReceiveTradePriceGateway } from './receive-trade-price/receive-trade-price.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ReceiveTradePriceGateway],
})
export class AppModule {}
