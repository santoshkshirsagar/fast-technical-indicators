import { CandleData } from '../types';

export interface DownsideTasukiGapInput {
  candles: CandleData[];
}

export function downsidetasukigap(input: DownsideTasukiGapInput): boolean[] {
  const { candles } = input;
  
  if (!candles || candles.length < 3) {
    return new Array(candles?.length || 0).fill(false);
  }

  const result: boolean[] = [];
  // First two candles can't be a downside tasuki gap
  result.push(false, false);

  for (let i = 2; i < candles.length; i++) {
    const firstCandle = candles[i - 2];  // First bearish candle
    const secondCandle = candles[i - 1]; // Second bearish candle (gaps down)
    const thirdCandle = candles[i];      // Bullish candle (fills gap partially)

    // Downside Tasuki Gap criteria:
    // 1. First candle is bearish
    // 2. Second candle is bearish and gaps down from first
    // 3. Third candle is bullish and closes within the gap (but doesn't fill it completely)
    // 4. Pattern suggests continuation of downtrend after brief retracement

    const firstIsBearish = firstCandle.close < firstCandle.open;
    const secondIsBearish = secondCandle.close < secondCandle.open;
    const thirdIsBullish = thirdCandle.close > thirdCandle.open;

    // Check for gap down between first and second candle
    const gapsDown = secondCandle.high < firstCandle.low;

    // Check third candle opens within second candle's range
    const opensInSecond = thirdCandle.open >= secondCandle.low && thirdCandle.open <= secondCandle.high;

    // Check third candle closes within the gap (but doesn't close it completely)
    const closesInGap = thirdCandle.close > secondCandle.high && thirdCandle.close < firstCandle.low;

    // All candles should have reasonable bodies
    const firstBodySize = Math.abs(firstCandle.close - firstCandle.open);
    const firstRange = firstCandle.high - firstCandle.low;
    const secondBodySize = Math.abs(secondCandle.close - secondCandle.open);
    const secondRange = secondCandle.high - secondCandle.low;
    const thirdBodySize = Math.abs(thirdCandle.close - thirdCandle.open);
    const thirdRange = thirdCandle.high - thirdCandle.low;

    const firstHasBody = firstRange > 0 && firstBodySize >= (firstRange * 0.5);
    const secondHasBody = secondRange > 0 && secondBodySize >= (secondRange * 0.5);
    const thirdHasBody = thirdRange > 0 && thirdBodySize >= (thirdRange * 0.5);

    const isDownsideTasukiGap = firstIsBearish && 
                                secondIsBearish && 
                                thirdIsBullish && 
                                gapsDown && 
                                opensInSecond && 
                                closesInGap && 
                                firstHasBody && 
                                secondHasBody && 
                                thirdHasBody;

    result.push(isDownsideTasukiGap);
  }

  return result;
}

export class DownsideTasukiGap {
  private candles: CandleData[] = [];

  constructor(input?: DownsideTasukiGapInput) {
    if (input?.candles?.length) {
      this.candles = [...input.candles];
    }
  }

  nextValue(candle: CandleData): boolean {
    this.candles.push(candle);
    const result = downsidetasukigap({ candles: this.candles });
    return result[result.length - 1] || false;
  }

  getResult(): boolean[] {
    return downsidetasukigap({ candles: this.candles });
  }

  static calculate = downsidetasukigap;
}