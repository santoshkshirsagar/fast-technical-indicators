import { CandleData } from '../types';

export interface TweezerTopInput {
  candles: CandleData[];
}

export function tweezertop(input: TweezerTopInput): boolean[] {
  const { candles } = input;
  
  if (!candles || candles.length < 2) {
    return new Array(candles?.length || 0).fill(false);
  }

  const result: boolean[] = [];
  result.push(false); // First candle can't be a tweezer top

  for (let i = 1; i < candles.length; i++) {
    const prevCandle = candles[i - 1];
    const currentCandle = candles[i];

    // Tweezer Top criteria:
    // 1. Two or more candles with nearly identical highs
    // 2. First candle is typically bullish
    // 3. Second candle is typically bearish (reversal signal)
    // 4. The highs should be very close (within a small tolerance)
    // 5. Pattern suggests resistance level and potential reversal

    const prevIsBullish = prevCandle.close > prevCandle.open;
    const currentIsBearish = currentCandle.close < currentCandle.open;

    // Calculate tolerance for "nearly identical" highs
    // Use 0.1% of the average price as tolerance
    const avgPrice = (prevCandle.high + currentCandle.high) / 2;
    const tolerance = avgPrice * 0.001; // 0.1% tolerance

    const highsAreEqual = Math.abs(prevCandle.high - currentCandle.high) <= tolerance;

    // Both candles should have reasonable bodies (not just dojis)
    const prevBodySize = Math.abs(prevCandle.close - prevCandle.open);
    const prevRange = prevCandle.high - prevCandle.low;
    const currentBodySize = Math.abs(currentCandle.close - currentCandle.open);
    const currentRange = currentCandle.high - currentCandle.low;

    const prevHasBody = prevRange > 0 && prevBodySize >= (prevRange * 0.3);
    const currentHasBody = currentRange > 0 && currentBodySize >= (currentRange * 0.3);

    // Additional check: the highs should be significant (touching or close to highs)
    const prevHighIsSignificant = prevCandle.high >= Math.max(prevCandle.open, prevCandle.close);
    const currentHighIsSignificant = currentCandle.high >= Math.max(currentCandle.open, currentCandle.close);

    const isTweezerTop = highsAreEqual && 
                         prevIsBullish && 
                         currentIsBearish && 
                         prevHasBody && 
                         currentHasBody &&
                         prevHighIsSignificant &&
                         currentHighIsSignificant;

    result.push(isTweezerTop);
  }

  return result;
}

export class TweezerTop {
  private candles: CandleData[] = [];

  constructor(input?: TweezerTopInput) {
    if (input?.candles?.length) {
      this.candles = [...input.candles];
    }
  }

  nextValue(candle: CandleData): boolean {
    this.candles.push(candle);
    const result = tweezertop({ candles: this.candles });
    return result[result.length - 1] || false;
  }

  getResult(): boolean[] {
    return tweezertop({ candles: this.candles });
  }

  static calculate = tweezertop;
}