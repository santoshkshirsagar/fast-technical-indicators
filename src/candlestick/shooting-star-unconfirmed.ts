import { CandleData } from '../types';

export interface ShootingStarUnconfirmedInput {
  candles: CandleData[];
}

export function shootingstarunconfirmed(input: ShootingStarUnconfirmedInput): boolean[] {
  const { candles } = input;
  
  if (!candles || candles.length === 0) {
    return [];
  }

  const result: boolean[] = [];

  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];
    const { open, high, low, close } = candle;

    // Shooting Star Unconfirmed criteria (less strict than confirmed shooting star):
    // 1. Small real body (body should be less than 1/2 of total range)
    // 2. Long upper shadow (at least 1.5 times the body size)
    // 3. Little or no lower shadow
    // 4. Body is in lower half of trading range

    const bodySize = Math.abs(close - open);
    const upperShadow = high - Math.max(open, close);
    const lowerShadow = Math.min(open, close) - low;
    const totalRange = high - low;

    // Less strict criteria for unconfirmed shooting star
    const isShootingStarUnconfirmed = totalRange > 0 &&
                                      bodySize < (totalRange / 2) && // Less strict body size
                                      upperShadow >= (bodySize * 1.5) && // Less strict upper shadow
                                      lowerShadow <= (bodySize * 1.2) && // More lenient lower shadow
                                      (high - Math.max(open, close)) >= (totalRange * 0.5); // Body in lower part

    result.push(isShootingStarUnconfirmed);
  }

  return result;
}

export class ShootingStarUnconfirmed {
  private candles: CandleData[] = [];

  constructor(input?: ShootingStarUnconfirmedInput) {
    if (input?.candles?.length) {
      this.candles = [...input.candles];
    }
  }

  nextValue(candle: CandleData): boolean {
    this.candles.push(candle);
    const result = shootingstarunconfirmed({ candles: [candle] });
    return result[0] || false;
  }

  getResult(): boolean[] {
    return shootingstarunconfirmed({ candles: this.candles });
  }

  static calculate = shootingstarunconfirmed;
}