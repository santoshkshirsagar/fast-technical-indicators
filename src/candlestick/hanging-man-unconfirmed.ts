import { CandleData } from '../types';

export interface HangingManUnconfirmedInput {
  candles: CandleData[];
}

export function hangingmanunconfirmed(input: HangingManUnconfirmedInput): boolean[] {
  const { candles } = input;
  
  if (!candles || candles.length === 0) {
    return [];
  }

  const result: boolean[] = [];

  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];
    const { open, high, low, close } = candle;

    // Hanging Man Unconfirmed criteria (less strict than confirmed hanging man):
    // 1. Small real body (body should be less than 1/2 of total range)
    // 2. Long lower shadow (at least 1.5 times the body size)
    // 3. Little or no upper shadow
    // 4. Body is in upper half of trading range

    const bodySize = Math.abs(close - open);
    const upperShadow = high - Math.max(open, close);
    const lowerShadow = Math.min(open, close) - low;
    const totalRange = high - low;

    // Less strict criteria for unconfirmed hanging man
    const isHangingManUnconfirmed = totalRange > 0 &&
                                    bodySize < (totalRange / 2) && // Less strict body size
                                    lowerShadow >= (bodySize * 1.5) && // Less strict lower shadow
                                    upperShadow <= (bodySize * 1.2) && // More lenient upper shadow
                                    (Math.min(open, close) - low) >= (totalRange * 0.5); // Body in upper part

    result.push(isHangingManUnconfirmed);
  }

  return result;
}

export class HangingManUnconfirmed {
  private candles: CandleData[] = [];

  constructor(input?: HangingManUnconfirmedInput) {
    if (input?.candles?.length) {
      this.candles = [...input.candles];
    }
  }

  nextValue(candle: CandleData): boolean {
    this.candles.push(candle);
    const result = hangingmanunconfirmed({ candles: [candle] });
    return result[0] || false;
  }

  getResult(): boolean[] {
    return hangingmanunconfirmed({ candles: this.candles });
  }

  static calculate = hangingmanunconfirmed;
}