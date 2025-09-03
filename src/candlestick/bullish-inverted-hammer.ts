import { CandleData } from '../types';

export interface BullishInvertedHammerInput {
  candles: CandleData[];
}

export function bullishinvertedhammer(input: BullishInvertedHammerInput): boolean[] {
  const { candles } = input;
  
  if (!candles || candles.length === 0) {
    return [];
  }

  const result: boolean[] = [];

  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];
    const { open, high, low, close } = candle;

    // Bullish Inverted Hammer criteria:
    // 1. Small real body (can be bullish or bearish)
    // 2. Long upper shadow (at least 2 times the body size)
    // 3. Little or no lower shadow
    // 4. Body is in the lower part of the trading range
    // 5. Should appear after a downtrend (context dependent)

    const bodySize = Math.abs(close - open);
    const upperShadow = high - Math.max(open, close);
    const lowerShadow = Math.min(open, close) - low;
    const totalRange = high - low;

    // Inverted Hammer criteria
    const isBullishInvertedHammer = totalRange > 0 &&
                                    bodySize < (totalRange / 3) && // Small body
                                    upperShadow >= (bodySize * 2) && // Long upper shadow
                                    lowerShadow <= (bodySize * 0.5) && // Small or no lower shadow
                                    (Math.min(open, close) - low) <= (totalRange * 0.3); // Body in lower part

    result.push(isBullishInvertedHammer);
  }

  return result;
}

export class BullishInvertedHammer {
  private candles: CandleData[] = [];

  constructor(input?: BullishInvertedHammerInput) {
    if (input?.candles?.length) {
      this.candles = [...input.candles];
    }
  }

  nextValue(candle: CandleData): boolean {
    this.candles.push(candle);
    const result = bullishinvertedhammer({ candles: [candle] });
    return result[0] || false;
  }

  getResult(): boolean[] {
    return bullishinvertedhammer({ candles: this.candles });
  }

  static calculate = bullishinvertedhammer;
}