import { CandleData } from '../types';

export interface DarkCloudCoverInput {
  candles: CandleData[];
}

export function darkcloudcover(input: DarkCloudCoverInput): boolean[] {
  const { candles } = input;
  
  if (!candles || candles.length < 2) {
    return new Array(candles?.length || 0).fill(false);
  }

  const result: boolean[] = [];
  result.push(false); // First candle can't be a dark cloud cover

  for (let i = 1; i < candles.length; i++) {
    const prevCandle = candles[i - 1];
    const currentCandle = candles[i];

    // Dark Cloud Cover criteria:
    // 1. Previous candle is bullish (white/green body)
    // 2. Current candle is bearish (black/red body)
    // 3. Current candle opens above previous candle's high
    // 4. Current candle closes below the midpoint of previous candle's body
    // 5. Both candles should have relatively large bodies

    const prevIsBullish = prevCandle.close > prevCandle.open;
    const currentIsBearish = currentCandle.close < currentCandle.open;

    // Current opens above previous high (gap up)
    const opensAbove = currentCandle.open > prevCandle.high;

    // Current closes below midpoint of previous body
    const prevMidpoint = (prevCandle.open + prevCandle.close) / 2;
    const closesBelowMidpoint = currentCandle.close < prevMidpoint;

    // Check for relatively large bodies
    const prevBodySize = Math.abs(prevCandle.close - prevCandle.open);
    const prevRange = prevCandle.high - prevCandle.low;
    const currentBodySize = Math.abs(currentCandle.close - currentCandle.open);
    const currentRange = currentCandle.high - currentCandle.low;

    const prevHasLargeBody = prevRange > 0 && prevBodySize >= (prevRange * 0.6);
    const currentHasLargeBody = currentRange > 0 && currentBodySize >= (currentRange * 0.6);

    const isDarkCloudCover = prevIsBullish && 
                             currentIsBearish && 
                             opensAbove && 
                             closesBelowMidpoint && 
                             prevHasLargeBody && 
                             currentHasLargeBody;

    result.push(isDarkCloudCover);
  }

  return result;
}

export class DarkCloudCover {
  private candles: CandleData[] = [];

  constructor(input?: DarkCloudCoverInput) {
    if (input?.candles?.length) {
      this.candles = [...input.candles];
    }
  }

  nextValue(candle: CandleData): boolean {
    this.candles.push(candle);
    const result = darkcloudcover({ candles: this.candles });
    return result[result.length - 1] || false;
  }

  getResult(): boolean[] {
    return darkcloudcover({ candles: this.candles });
  }

  static calculate = darkcloudcover;
}