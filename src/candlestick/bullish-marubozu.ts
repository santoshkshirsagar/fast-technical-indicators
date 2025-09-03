import { CandleData } from '../types';

export interface BullishMarubozuInput {
  candles: CandleData[];
}

export function bullishmarubozu(input: BullishMarubozuInput): boolean[] {
  const { candles } = input;
  
  if (!candles || candles.length === 0) {
    return [];
  }

  const result: boolean[] = [];

  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];
    const { open, high, low, close } = candle;

    // Bullish Marubozu criteria:
    // 1. Bullish candle (close > open)
    // 2. Large real body (body should be most of the total range)
    // 3. Little or no shadows (shadows should be very small relative to body)
    // 4. Open equals or is very close to low
    // 5. Close equals or is very close to high

    const isBullish = close > open;
    const bodySize = Math.abs(close - open);
    const upperShadow = high - Math.max(open, close);
    const lowerShadow = Math.min(open, close) - low;
    const totalRange = high - low;

    const shadowTolerance = totalRange * 0.02; // 2% tolerance for shadows
    
    const isBullishMarubozu = totalRange > 0 &&
                              isBullish &&
                              bodySize >= (totalRange * 0.95) && // Body is at least 95% of range
                              upperShadow <= shadowTolerance &&
                              lowerShadow <= shadowTolerance &&
                              Math.abs(open - low) <= shadowTolerance && // Open near low
                              Math.abs(close - high) <= shadowTolerance; // Close near high

    result.push(isBullishMarubozu);
  }

  return result;
}

export class BullishMarubozu {
  private candles: CandleData[] = [];

  constructor(input?: BullishMarubozuInput) {
    if (input?.candles?.length) {
      this.candles = [...input.candles];
    }
  }

  nextValue(candle: CandleData): boolean {
    this.candles.push(candle);
    const result = bullishmarubozu({ candles: [candle] });
    return result[0] || false;
  }

  getResult(): boolean[] {
    return bullishmarubozu({ candles: this.candles });
  }

  static calculate = bullishmarubozu;
}