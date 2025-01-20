import { Test, TestingModule } from '@nestjs/testing';
import { TradePricePipeBridgeService } from './trade-price-pipe-bridge.service';

describe('TradePricePipeBridgeService', () => {
  let service: TradePricePipeBridgeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradePricePipeBridgeService],
    }).compile();

    service = module.get<TradePricePipeBridgeService>(
      TradePricePipeBridgeService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
