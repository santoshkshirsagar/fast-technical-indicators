import { CandleData } from '../types';

export interface MorningDojiStarInput {
  candles: CandleData[];
}

export function morningdojistar(input: MorningDojiStarInput): boolean[] {
  const { candles } = input;
  
  if (!candles || candles.length < 3) {
    return new Array(candles?.length || 0).fill(false);
  }

  const result: boolean[] = [];
  // First two candles can't be a morning doji star
  result.push(false, false);

  for (let i = 2; i < candles.length; i++) {
    const firstCandle = candles[i - 2];  // Bearish candle
    const secondCandle = candles[i - 1]; // Doji star
    const thirdCandle = candles[i];      // Bullish candle

    // Morning Doji Star criteria:
    // 1. First candle is bearish with a large body
    // 2. Second candle is a doji that gaps down
    // 3. Third candle is bullish and closes well into first candle's body

    const firstIsBearish = firstCandle.close < firstCandle.open;
    const thirdIsBullish = thirdCandle.close > thirdCandle.open;

    // Check first candle has large body
    const firstBodySize = Math.abs(firstCandle.close - firstCandle.open);
    const firstRange = firstCandle.high - firstCandle.low;
    const firstHasLargeBody = firstRange > 0 && firstBodySize >= (firstRange * 0.6);

    // Check second candle is a doji
    const secondBodySize = Math.abs(secondCandle.close - secondCandle.open);
    const secondRange = secondCandle.high - secondCandle.low;
    const secondIsDoji = secondRange > 0 && secondBodySize <= (secondRange * 0.1); // Very small body

    // Check for gap down between first and second candle
    const gapsDown = secondCandle.high < firstCandle.low;

    // Check third candle closes well into first candle's body
    const firstMidpoint = (firstCandle.open + firstCandle.close) / 2;
    const closesIntoBody = thirdCandle.close > firstMidpoint;

    // Check third candle has reasonable body
    const thirdBodySize = Math.abs(thirdCandle.close - thirdCandle.open);
    const thirdRange = thirdCandle.high - thirdCandle.low;
    const thirdHasBody = thirdRange > 0 && thirdBodySize >= (thirdRange * 0.4);

    const isMorningDojiStar = firstIsBearish && 
                              firstHasLargeBody && 
                              secondIsDoji && 
                              gapsDown && 
                              thirdIsBullish && 
                              thirdHasBody && 
                              closesIntoBody;

    result.push(isMorningDojiStar);
  }

  return result;
}

export class MorningDojiStar {
  private candles: CandleData[] = [];

  constructor(input?: MorningDojiStarInput) {
    if (input?.candles?.length) {
      this.candles = [...input.candles];
    }
  }

  nextValue(candle: CandleData): boolean {
    this.candles.push(candle);
    const result = morningdojistar({ candles: this.candles });
    return result[result.length - 1] || false;
  }

  getResult(): boolean[] {
    return morningdojistar({ candles: this.candles });
  }

  static calculate = morningdojistar;
}