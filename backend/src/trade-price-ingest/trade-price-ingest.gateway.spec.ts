import { Test, TestingModule } from '@nestjs/testing';
import { TradePriceIngestGateway } from './trade-price-ingest.gateway';

describe('TradePriceIngestGateway', () => {
  let gateway: TradePriceIngestGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradePriceIngestGateway],
    }).compile();

    gateway = module.get<TradePriceIngestGateway>(TradePriceIngestGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
