import { CandleData } from '../types';

export interface BearishMarubozuInput {
  candles: CandleData[];
}

export function bearishmarubozu(input: BearishMarubozuInput): boolean[] {
  const { candles } = input;
  
  if (!candles || candles.length === 0) {
    return [];
  }

  const result: boolean[] = [];

  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];
    const { open, high, low, close } = candle;

    // Bearish Marubozu criteria:
    // 1. Bearish candle (close < open)
    // 2. Large real body (body should be most of the total range)
    // 3. Little or no shadows (shadows should be very small relative to body)
    // 4. Open equals or is very close to high
    // 5. Close equals or is very close to low

    const isBearish = close < open;
    const bodySize = Math.abs(close - open);
    const upperShadow = high - Math.max(open, close);
    const lowerShadow = Math.min(open, close) - low;
    const totalRange = high - low;

    const shadowTolerance = totalRange * 0.02; // 2% tolerance for shadows
    
    const isBearishMarubozu = totalRange > 0 &&
                              isBearish &&
                              bodySize >= (totalRange * 0.95) && // Body is at least 95% of range
                              upperShadow <= shadowTolerance &&
                              lowerShadow <= shadowTolerance &&
                              Math.abs(open - high) <= shadowTolerance && // Open near high
                              Math.abs(close - low) <= shadowTolerance; // Close near low

    result.push(isBearishMarubozu);
  }

  return result;
}

export class BearishMarubozu {
  private candles: CandleData[] = [];

  constructor(input?: BearishMarubozuInput) {
    if (input?.candles?.length) {
      this.candles = [...input.candles];
    }
  }

  nextValue(candle: CandleData): boolean {
    this.candles.push(candle);
    const result = bearishmarubozu({ candles: [candle] });
    return result[0] || false;
  }

  getResult(): boolean[] {
    return bearishmarubozu({ candles: this.candles });
  }

  static calculate = bearishmarubozu;
}