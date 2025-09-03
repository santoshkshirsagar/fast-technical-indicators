import { CandleData } from '../types';

export interface PiercingLineInput {
  candles: CandleData[];
}

export function piercingline(input: PiercingLineInput): boolean[] {
  const { candles } = input;
  
  if (!candles || candles.length < 2) {
    return new Array(candles?.length || 0).fill(false);
  }

  const result: boolean[] = [];
  result.push(false); // First candle can't be a piercing line

  for (let i = 1; i < candles.length; i++) {
    const prevCandle = candles[i - 1];
    const currentCandle = candles[i];

    // Piercing Line criteria:
    // 1. Previous candle is bearish (black/red body)
    // 2. Current candle is bullish (white/green body)
    // 3. Current candle opens below previous candle's low
    // 4. Current candle closes above the midpoint of previous candle's body
    // 5. Both candles should have relatively large bodies

    const prevIsBearish = prevCandle.close < prevCandle.open;
    const currentIsBullish = currentCandle.close > currentCandle.open;

    // Current opens below previous low (gap down)
    const opensBelow = currentCandle.open < prevCandle.low;

    // Current closes above midpoint of previous body
    const prevMidpoint = (prevCandle.open + prevCandle.close) / 2;
    const closesAboveMidpoint = currentCandle.close > prevMidpoint;

    // Check for relatively large bodies
    const prevBodySize = Math.abs(prevCandle.close - prevCandle.open);
    const prevRange = prevCandle.high - prevCandle.low;
    const currentBodySize = Math.abs(currentCandle.close - currentCandle.open);
    const currentRange = currentCandle.high - currentCandle.low;

    const prevHasLargeBody = prevRange > 0 && prevBodySize >= (prevRange * 0.6);
    const currentHasLargeBody = currentRange > 0 && currentBodySize >= (currentRange * 0.6);

    const isPiercingLine = prevIsBearish && 
                           currentIsBullish && 
                           opensBelow && 
                           closesAboveMidpoint && 
                           prevHasLargeBody && 
                           currentHasLargeBody;

    result.push(isPiercingLine);
  }

  return result;
}

export class PiercingLine {
  private candles: CandleData[] = [];

  constructor(input?: PiercingLineInput) {
    if (input?.candles?.length) {
      this.candles = [...input.candles];
    }
  }

  nextValue(candle: CandleData): boolean {
    this.candles.push(candle);
    const result = piercingline({ candles: this.candles });
    return result[result.length - 1] || false;
  }

  getResult(): boolean[] {
    return piercingline({ candles: this.candles });
  }

  static calculate = piercingline;
}