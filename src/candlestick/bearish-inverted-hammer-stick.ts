import { CandleData } from '../types';

export interface BearishInvertedHammerStickInput {
  candles: CandleData[];
}

export function bearishinvertedhammerstick(input: BearishInvertedHammerStickInput): boolean[] {
  const { candles } = input;
  
  if (!candles || candles.length === 0) {
    return [];
  }

  const result: boolean[] = [];

  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];
    const { open, high, low, close } = candle;

    // Bearish Inverted Hammer Stick criteria:
    // 1. Bearish candle (close < open)
    // 2. Small real body
    // 3. Long upper shadow (at least 2 times the body size)
    // 4. Little or no lower shadow
    // 5. Body is in lower part of trading range

    const isBearish = close < open;
    const bodySize = Math.abs(close - open);
    const upperShadow = high - Math.max(open, close);
    const lowerShadow = Math.min(open, close) - low;
    const totalRange = high - low;

    const isBearishInvertedHammerStick = totalRange > 0 &&
                                         isBearish &&
                                         bodySize < (totalRange / 3) && // Small body
                                         upperShadow >= (bodySize * 2) && // Long upper shadow
                                         lowerShadow <= (bodySize * 0.5) && // Small or no lower shadow
                                         (Math.min(open, close) - low) <= (totalRange * 0.3); // Body in lower part

    result.push(isBearishInvertedHammerStick);
  }

  return result;
}

export class BearishInvertedHammerStick {
  private candles: CandleData[] = [];

  constructor(input?: BearishInvertedHammerStickInput) {
    if (input?.candles?.length) {
      this.candles = [...input.candles];
    }
  }

  nextValue(candle: CandleData): boolean {
    this.candles.push(candle);
    const result = bearishinvertedhammerstick({ candles: [candle] });
    return result[0] || false;
  }

  getResult(): boolean[] {
    return bearishinvertedhammerstick({ candles: this.candles });
  }

  static calculate = bearishinvertedhammerstick;
}