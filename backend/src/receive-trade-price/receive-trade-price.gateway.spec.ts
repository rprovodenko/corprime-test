import { Test, TestingModule } from '@nestjs/testing';
import { ReceiveTradePriceGateway } from './receive-trade-price.gateway';

describe('ReceiveTradePriceGateway', () => {
  let gateway: ReceiveTradePriceGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiveTradePriceGateway],
    }).compile();

    gateway = module.get<ReceiveTradePriceGateway>(ReceiveTradePriceGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
