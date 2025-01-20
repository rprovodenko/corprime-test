import { Test, TestingModule } from '@nestjs/testing';
import { TradePriceMonitorGateway } from './trade-price-monitor.gateway';

describe('TradePriceMonitorGateway', () => {
  let gateway: TradePriceMonitorGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradePriceMonitorGateway],
    }).compile();

    gateway = module.get<TradePriceMonitorGateway>(TradePriceMonitorGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
