import { CandleData } from '../types';

export interface TweezerBottomInput {
  candles: CandleData[];
}

export function tweezerbottom(input: TweezerBottomInput): boolean[] {
  const { candles } = input;
  
  if (!candles || candles.length < 2) {
    return new Array(candles?.length || 0).fill(false);
  }

  const result: boolean[] = [];
  result.push(false); // First candle can't be a tweezer bottom

  for (let i = 1; i < candles.length; i++) {
    const prevCandle = candles[i - 1];
    const currentCandle = candles[i];

    // Tweezer Bottom criteria:
    // 1. Two or more candles with nearly identical lows
    // 2. First candle is typically bearish
    // 3. Second candle is typically bullish (reversal signal)
    // 4. The lows should be very close (within a small tolerance)
    // 5. Pattern suggests support level and potential reversal

    const prevIsBearish = prevCandle.close < prevCandle.open;
    const currentIsBullish = currentCandle.close > currentCandle.open;

    // Calculate tolerance for "nearly identical" lows
    // Use 0.1% of the average price as tolerance
    const avgPrice = (prevCandle.low + currentCandle.low) / 2;
    const tolerance = avgPrice * 0.001; // 0.1% tolerance

    const lowsAreEqual = Math.abs(prevCandle.low - currentCandle.low) <= tolerance;

    // Both candles should have reasonable bodies (not just dojis)
    const prevBodySize = Math.abs(prevCandle.close - prevCandle.open);
    const prevRange = prevCandle.high - prevCandle.low;
    const currentBodySize = Math.abs(currentCandle.close - currentCandle.open);
    const currentRange = currentCandle.high - currentCandle.low;

    const prevHasBody = prevRange > 0 && prevBodySize >= (prevRange * 0.3);
    const currentHasBody = currentRange > 0 && currentBodySize >= (currentRange * 0.3);

    // Additional check: the lows should be significant (touching or close to lows)
    const prevLowIsSignificant = prevCandle.low <= Math.min(prevCandle.open, prevCandle.close);
    const currentLowIsSignificant = currentCandle.low <= Math.min(currentCandle.open, currentCandle.close);

    const isTweezerBottom = lowsAreEqual && 
                            prevIsBearish && 
                            currentIsBullish && 
                            prevHasBody && 
                            currentHasBody &&
                            prevLowIsSignificant &&
                            currentLowIsSignificant;

    result.push(isTweezerBottom);
  }

  return result;
}

export class TweezerBottom {
  private candles: CandleData[] = [];

  constructor(input?: TweezerBottomInput) {
    if (input?.candles?.length) {
      this.candles = [...input.candles];
    }
  }

  nextValue(candle: CandleData): boolean {
    this.candles.push(candle);
    const result = tweezerbottom({ candles: this.candles });
    return result[result.length - 1] || false;
  }

  getResult(): boolean[] {
    return tweezerbottom({ candles: this.candles });
  }

  static calculate = tweezerbottom;
}