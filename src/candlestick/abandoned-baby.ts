import { CandleData } from '../types';

export interface AbandonedBabyInput {
  candles: CandleData[];
}

export function abandonedbaby(input: AbandonedBabyInput): boolean[] {
  const { candles } = input;
  
  if (!candles || candles.length < 3) {
    return new Array(candles?.length || 0).fill(false);
  }

  const result: boolean[] = [];
  // First two candles can't be an abandoned baby
  result.push(false, false);

  for (let i = 2; i < candles.length; i++) {
    const firstCandle = candles[i - 2];  
    const secondCandle = candles[i - 1]; // Doji (baby)
    const thirdCandle = candles[i];      

    // Abandoned Baby criteria:
    // 1. Middle candle is a Doji (very small body)
    // 2. Middle candle gaps away from both adjacent candles (isolated)
    // 3. First and third candles have opposite directions
    // 4. Pattern indicates strong reversal

    // Check if middle candle is a doji
    const secondBodySize = Math.abs(secondCandle.close - secondCandle.open);
    const secondRange = secondCandle.high - secondCandle.low;
    const isDoji = secondRange > 0 && secondBodySize <= (secondRange * 0.1); // Very small body

    // Check for gaps (doji is isolated)
    const gapsDownFromFirst = secondCandle.high < firstCandle.low;
    const gapsUpFromFirst = secondCandle.low > firstCandle.high;
    const gapsDownFromThird = secondCandle.high < thirdCandle.low;
    const gapsUpFromThird = secondCandle.low > thirdCandle.high;

    // The doji should be isolated from both candles
    const isIsolated = (gapsDownFromFirst || gapsUpFromFirst) && 
                       (gapsDownFromThird || gapsUpFromThird);

    // Check for reversal pattern (opposite directions)
    const firstIsBearish = firstCandle.close < firstCandle.open;
    const firstIsBullish = firstCandle.close > firstCandle.open;
    const thirdIsBearish = thirdCandle.close < thirdCandle.open;
    const thirdIsBullish = thirdCandle.close > thirdCandle.open;

    const isReversal = (firstIsBearish && thirdIsBullish) || (firstIsBullish && thirdIsBearish);

    // Both first and third candles should have reasonable bodies
    const firstBodySize = Math.abs(firstCandle.close - firstCandle.open);
    const firstRange = firstCandle.high - firstCandle.low;
    const thirdBodySize = Math.abs(thirdCandle.close - thirdCandle.open);
    const thirdRange = thirdCandle.high - thirdCandle.low;

    const firstHasBody = firstRange > 0 && firstBodySize >= (firstRange * 0.5);
    const thirdHasBody = thirdRange > 0 && thirdBodySize >= (thirdRange * 0.5);

    const isAbandonedBaby = isDoji && 
                            isIsolated && 
                            isReversal && 
                            firstHasBody && 
                            thirdHasBody;

    result.push(isAbandonedBaby);
  }

  return result;
}

export class AbandonedBaby {
  private candles: CandleData[] = [];

  constructor(input?: AbandonedBabyInput) {
    if (input?.candles?.length) {
      this.candles = [...input.candles];
    }
  }

  nextValue(candle: CandleData): boolean {
    this.candles.push(candle);
    const result = abandonedbaby({ candles: this.candles });
    return result[result.length - 1] || false;
  }

  getResult(): boolean[] {
    return abandonedbaby({ candles: this.candles });
  }

  static calculate = abandonedbaby;
}