import { Test, TestingModule } from '@nestjs/testing';
import { LastTradePriceService } from './last-trade-price.service';

describe('LastTradePriceService', () => {
  let service: LastTradePriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LastTradePriceService],
    }).compile();

    service = module.get<LastTradePriceService>(LastTradePriceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
