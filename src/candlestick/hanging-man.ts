import { CandleData } from '../types';

export interface HangingManInput {
  candles: CandleData[];
}

export function hangingman(input: HangingManInput): boolean[] {
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

    // Hanging Man criteria (similar to hammer but in uptrend context):
    // 1. Small real body (body should be less than 1/3 of total range)
    // 2. Long lower shadow (at least 2 times the body size)
    // 3. Little or no upper shadow (upper shadow should be less than body size)
    // 4. Body is in upper half of trading range
    // Note: Context (uptrend vs downtrend) would need to be determined externally

    const isHangingMan = totalRange > 0 &&
                         bodySize < (totalRange / 3) &&
                         lowerShadow >= (bodySize * 2) &&
                         upperShadow <= bodySize &&
                         (Math.min(open, close) - low) >= (totalRange * 0.6);

    result.push(isHangingMan);
  }

  return result;
}

export class HangingManPattern {
  private candles: CandleData[] = [];

  constructor(input?: HangingManInput) {
    if (input?.candles?.length) {
      this.candles = [...input.candles];
    }
  }

  nextValue(candle: CandleData): boolean {
    this.candles.push(candle);
    const result = hangingman({ candles: [candle] });
    return result[0] || false;
  }

  getResult(): boolean[] {
    return hangingman({ candles: this.candles });
  }

  static calculate = hangingman;
}