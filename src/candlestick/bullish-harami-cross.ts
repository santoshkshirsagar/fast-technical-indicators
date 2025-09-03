import { CandleData } from '../types';

export interface BullishHaramiCrossInput {
  candles: CandleData[];
}

export function bullishharamicross(input: BullishHaramiCrossInput): boolean[] {
  const { candles } = input;
  
  if (!candles || candles.length < 2) {
    return new Array(candles?.length || 0).fill(false);
  }

  const result: boolean[] = [];
  result.push(false); // First candle can't be a harami cross

  for (let i = 1; i < candles.length; i++) {
    const prevCandle = candles[i - 1];
    const currentCandle = candles[i];

    // Bullish Harami Cross criteria:
    // 1. Previous candle is bearish (long black/red body)
    // 2. Current candle is a doji (open ≈ close) 
    // 3. Current candle's body is completely within previous candle's body
    // 4. Previous candle should have a relatively large body

    const prevIsBearish = prevCandle.close < prevCandle.open;

    // Check if current candle is a doji
    const currentBodySize = Math.abs(currentCandle.close - currentCandle.open);
    const currentRange = currentCandle.high - currentCandle.low;
    const isDoji = currentRange > 0 && currentBodySize <= (currentRange * 0.1); // Very small body

    // Check if current candle's range is within previous candle's body
    const prevBodyTop = Math.max(prevCandle.open, prevCandle.close);
    const prevBodyBottom = Math.min(prevCandle.open, prevCandle.close);
    const currentHigh = currentCandle.high;
    const currentLow = currentCandle.low;

    const isWithinBody = currentHigh < prevBodyTop && currentLow > prevBodyBottom;

    // Previous candle should have a reasonable body size
    const prevBodySize = Math.abs(prevCandle.close - prevCandle.open);
    const prevRange = prevCandle.high - prevCandle.low;
    const hasLargeBody = prevRange > 0 && prevBodySize >= (prevRange * 0.6);

    const isBullishHaramiCross = prevIsBearish && isDoji && isWithinBody && hasLargeBody;

    result.push(isBullishHaramiCross);
  }

  return result;
}

export class BullishHaramiCross {
  private candles: CandleData[] = [];

  constructor(input?: BullishHaramiCrossInput) {
    if (input?.candles?.length) {
      this.candles = [...input.candles];
    }
  }

  nextValue(candle: CandleData): boolean {
    this.candles.push(candle);
    const result = bullishharamicross({ candles: this.candles });
    return result[result.length - 1] || false;
  }

  getResult(): boolean[] {
    return bullishharamicross({ candles: this.candles });
  }

  static calculate = bullishharamicross;
}