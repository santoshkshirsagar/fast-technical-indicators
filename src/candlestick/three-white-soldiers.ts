import { CandleData } from '../types';

export interface ThreeWhiteSoldiersInput {
  candles: CandleData[];
}

export function threewhitesoldiers(input: ThreeWhiteSoldiersInput): boolean[] {
  const { candles } = input;
  
  if (!candles || candles.length < 3) {
    return new Array(candles?.length || 0).fill(false);
  }

  const result: boolean[] = [];
  
  // Fill first two positions with false since we need 3 candles
  result.push(false, false);

  for (let i = 2; i < candles.length; i++) {
    const candle1 = candles[i - 2]; // Oldest
    const candle2 = candles[i - 1]; // Middle
    const candle3 = candles[i];     // Current

    // Three White Soldiers criteria:
    // 1. Three consecutive bullish candles
    // 2. Each candle closes higher than the previous
    // 3. Each candle opens within or near the body of the previous candle
    // 4. Each candle has a relatively large body with small wicks

    const isBullish1 = candle1.close > candle1.open;
    const isBullish2 = candle2.close > candle2.open;
    const isBullish3 = candle3.close > candle3.open;

    const closesHigher = candle2.close > candle1.close && candle3.close > candle2.close;
    
    // Check if opens are within previous candle's body
    const opensWithinBody = 
      candle2.open >= candle1.open && candle2.open <= candle1.close &&
      candle3.open >= candle2.open && candle3.open <= candle2.close;

    // Check for relatively large bodies (bodies should be at least 60% of the range)
    const body1 = Math.abs(candle1.close - candle1.open);
    const range1 = candle1.high - candle1.low;
    const body2 = Math.abs(candle2.close - candle2.open);
    const range2 = candle2.high - candle2.low;
    const body3 = Math.abs(candle3.close - candle3.open);
    const range3 = candle3.high - candle3.low;

    const largeBodies = range1 > 0 && range2 > 0 && range3 > 0 &&
                        body1 >= range1 * 0.6 &&
                        body2 >= range2 * 0.6 &&
                        body3 >= range3 * 0.6;

    const isThreeWhiteSoldiers = isBullish1 && isBullish2 && isBullish3 &&
                                 closesHigher && opensWithinBody && largeBodies;

    result.push(isThreeWhiteSoldiers);
  }

  return result;
}

export class ThreeWhiteSoldiersPattern {
  private candles: CandleData[] = [];

  constructor(input?: ThreeWhiteSoldiersInput) {
    if (input?.candles?.length) {
      this.candles = [...input.candles];
    }
  }

  nextValue(candle: CandleData): boolean {
    this.candles.push(candle);
    const result = threewhitesoldiers({ candles: this.candles });
    return result[result.length - 1] || false;
  }

  getResult(): boolean[] {
    return threewhitesoldiers({ candles: this.candles });
  }

  static calculate = threewhitesoldiers;
}