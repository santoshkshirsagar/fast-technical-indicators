import { CandleData } from '../types';

export interface BearishHaramiInput {
  candles: CandleData[];
}

export function bearishharami(input: BearishHaramiInput): boolean[] {
  const { candles } = input;
  
  if (!candles || candles.length < 2) {
    return new Array(candles?.length || 0).fill(false);
  }

  const result: boolean[] = [];
  result.push(false); // First candle can't be a harami

  for (let i = 1; i < candles.length; i++) {
    const prevCandle = candles[i - 1];
    const currentCandle = candles[i];

    // Bearish Harami criteria:
    // 1. Previous candle is bullish (long white/green body)
    // 2. Current candle is bearish (black/red body) 
    // 3. Current candle's body is completely within previous candle's body
    // 4. Previous candle should have a relatively large body

    const prevIsBullish = prevCandle.close > prevCandle.open;
    const currentIsBearish = currentCandle.close < currentCandle.open;

    // Check if current candle's body is within previous candle's body
    const prevBodyTop = Math.max(prevCandle.open, prevCandle.close);
    const prevBodyBottom = Math.min(prevCandle.open, prevCandle.close);
    const currentBodyTop = Math.max(currentCandle.open, currentCandle.close);
    const currentBodyBottom = Math.min(currentCandle.open, currentCandle.close);

    const isWithinBody = currentBodyTop < prevBodyTop && currentBodyBottom > prevBodyBottom;

    // Previous candle should have a reasonable body size
    const prevBodySize = Math.abs(prevCandle.close - prevCandle.open);
    const prevRange = prevCandle.high - prevCandle.low;
    const hasLargeBody = prevRange > 0 && prevBodySize >= (prevRange * 0.6);

    const isBearishHarami = prevIsBullish && currentIsBearish && isWithinBody && hasLargeBody;

    result.push(isBearishHarami);
  }

  return result;
}

export class BearishHarami {
  private candles: CandleData[] = [];

  constructor(input?: BearishHaramiInput) {
    if (input?.candles?.length) {
      this.candles = [...input.candles];
    }
  }

  nextValue(candle: CandleData): boolean {
    this.candles.push(candle);
    const result = bearishharami({ candles: this.candles });
    return result[result.length - 1] || false;
  }

  getResult(): boolean[] {
    return bearishharami({ candles: this.candles });
  }

  static calculate = bearishharami;
}