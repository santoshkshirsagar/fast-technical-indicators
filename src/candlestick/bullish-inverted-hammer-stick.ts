import { CandleData } from '../types';

export interface BullishInvertedHammerStickInput {
  candles: CandleData[];
}

export function bullishinvertedhammerstick(input: BullishInvertedHammerStickInput): boolean[] {
  const { candles } = input;
  
  if (!candles || candles.length === 0) {
    return [];
  }

  const result: boolean[] = [];

  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];
    const { open, high, low, close } = candle;

    // Bullish Inverted Hammer Stick criteria:
    // 1. Bullish candle (close > open)
    // 2. Small real body
    // 3. Long upper shadow (at least 2 times the body size)
    // 4. Little or no lower shadow
    // 5. Body is in lower part of trading range

    const isBullish = close > open;
    const bodySize = Math.abs(close - open);
    const upperShadow = high - Math.max(open, close);
    const lowerShadow = Math.min(open, close) - low;
    const totalRange = high - low;

    const isBullishInvertedHammerStick = totalRange > 0 &&
                                         isBullish &&
                                         bodySize < (totalRange / 3) && // Small body
                                         upperShadow >= (bodySize * 2) && // Long upper shadow
                                         lowerShadow <= (bodySize * 0.5) && // Small or no lower shadow
                                         (Math.min(open, close) - low) <= (totalRange * 0.3); // Body in lower part

    result.push(isBullishInvertedHammerStick);
  }

  return result;
}

export class BullishInvertedHammerStick {
  private candles: CandleData[] = [];

  constructor(input?: BullishInvertedHammerStickInput) {
    if (input?.candles?.length) {
      this.candles = [...input.candles];
    }
  }

  nextValue(candle: CandleData): boolean {
    this.candles.push(candle);
    const result = bullishinvertedhammerstick({ candles: [candle] });
    return result[0] || false;
  }

  getResult(): boolean[] {
    return bullishinvertedhammerstick({ candles: this.candles });
  }

  static calculate = bullishinvertedhammerstick;
}