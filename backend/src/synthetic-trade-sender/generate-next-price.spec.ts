import { generateNextPrice } from './generate-next-price';

describe('Synthethic trade sender - generate next price', () => {
  it('generates correct price - #1', () => {
    expect(generateNextPrice(0, 100000, 20000)).toBeLessThan(30000);
  });

  it('generates correct price - #2', () => {
    expect(generateNextPrice(1000000, 100000, 20000)).toBeGreaterThan(80000);
  });

  it('generates correct price - #3', () => {
    expect(generateNextPrice(2000000, 100000, 20000)).toBeGreaterThan(90000);
  });

  it('generates correct price - #4', () => {
    expect(generateNextPrice(3000000, 100000, 20000)).toBeLessThan(40000);
  });

  it('generates correct price - #5', () => {
    expect(generateNextPrice(4000000, 100000, 20000)).toBeLessThan(30000);
  });
});
