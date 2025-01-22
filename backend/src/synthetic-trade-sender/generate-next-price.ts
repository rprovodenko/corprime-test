/**
 * Very simple sin graph between minPrice and maxPrice and some noise
 */

export function generateNextPrice(
  timeStep: number,
  maxPrice: number,
  minPrice: number,
  noiseFactor: number = 100,
) {
  const sin = Math.sin(timeStep / 1000000) * (maxPrice - minPrice) + minPrice;
  const noise = Math.random() * noiseFactor;
  const noiseWithSign = Math.random() < 0.5 ? noise : noise * -1;
  return Math.floor((sin + noiseWithSign) * 100) / 100;
}
