import { CandleData } from '../types';

export interface ShootingStarInput {
  candles: CandleData[];
}

export function shootingstar(input: ShootingStarInput): boolean[] {
  const { candles } = input;
  
  if (!candles || candles.length === 0) {
    return [];
  }

  const result: boolean[] = [];

  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];
    const { open, high, low, close } = candle;

    // Calculate body size
    const bodySize = Math.abs(close - open);
    const upperShadow = high - Math.max(open, close);
    const lowerShadow = Math.min(open, close) - low;
    const totalRange = high - low;

    // Shooting Star criteria:
    // 1. Small real body (body should be less than 1/3 of total range)
    // 2. Long upper shadow (at least 2 times the body size)
    // 3. Little or no lower shadow (lower shadow should be less than body size)
    // 4. Body is in lower half of trading range

    const isShootingStar = totalRange > 0 &&
                           bodySize < (totalRange / 3) &&
                           upperShadow >= (bodySize * 2) &&
                           lowerShadow <= bodySize &&
                           (high - Math.max(open, close)) >= (totalRange * 0.6);

    result.push(isShootingStar);
  }

  return result;
}

export class ShootingStarPattern {
  private candles: CandleData[] = [];

  constructor(input?: ShootingStarInput) {
    if (input?.candles?.length) {
      this.candles = [...input.candles];
    }
  }

  nextValue(candle: CandleData): boolean {
    this.candles.push(candle);
    const result = shootingstar({ candles: [candle] });
    return result[0] || false;
  }

  getResult(): boolean[] {
    return shootingstar({ candles: this.candles });
  }

  static calculate = shootingstar;
}