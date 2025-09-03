import { CandleData } from '../types';

export interface SpinningTopInput {
  candles: CandleData[];
}

export function spinningtop(input: SpinningTopInput): boolean[] {
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

    // Spinning Top criteria:
    // 1. Small real body (body should be less than 1/3 of total range)
    // 2. Long upper and lower shadows (both should be at least equal to body size)
    // 3. Body is roughly in the middle of the trading range

    const isSpinningTop = totalRange > 0 &&
                          bodySize < (totalRange / 3) &&
                          upperShadow >= bodySize &&
                          lowerShadow >= bodySize &&
                          bodySize > 0; // Must have some body (not a doji)

    result.push(isSpinningTop);
  }

  return result;
}

export class SpinningTopPattern {
  private candles: CandleData[] = [];

  constructor(input?: SpinningTopInput) {
    if (input?.candles?.length) {
      this.candles = [...input.candles];
    }
  }

  nextValue(candle: CandleData): boolean {
    this.candles.push(candle);
    const result = spinningtop({ candles: [candle] });
    return result[0] || false;
  }

  getResult(): boolean[] {
    return spinningtop({ candles: this.candles });
  }

  static calculate = spinningtop;
}