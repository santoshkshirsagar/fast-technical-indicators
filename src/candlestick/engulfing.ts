import { CandleData } from '../types';

export interface EngulfingInput {
  candles: CandleData[];
}

// Bullish Engulfing Pattern
export function bullishengulfingpattern(input: EngulfingInput): boolean[] {
  const { candles } = input;
  const result: boolean[] = [];
  
  if (candles.length < 2) {
    return candles.map(() => false);
  }
  
  // First candle can't be engulfing
  result.push(false);
  
  for (let i = 1; i < candles.length; i++) {
    const prevCandle = candles[i - 1];
    const currentCandle = candles[i];
    
    // Previous candle should be bearish
    const prevIsBearish = prevCandle.close < prevCandle.open;
    
    // Current candle should be bullish
    const currentIsBullish = currentCandle.close > currentCandle.open;
    
    // Current candle should engulf previous candle
    const engulfs = currentCandle.open < prevCandle.close && 
                    currentCandle.close > prevCandle.open;
    
    const isBullishEngulfing = prevIsBearish && currentIsBullish && engulfs;
    result.push(isBullishEngulfing);
  }
  
  return result;
}

// Bearish Engulfing Pattern
export function bearishengulfingpattern(input: EngulfingInput): boolean[] {
  const { candles } = input;
  const result: boolean[] = [];
  
  if (candles.length < 2) {
    return candles.map(() => false);
  }
  
  // First candle can't be engulfing
  result.push(false);
  
  for (let i = 1; i < candles.length; i++) {
    const prevCandle = candles[i - 1];
    const currentCandle = candles[i];
    
    // Previous candle should be bullish
    const prevIsBullish = prevCandle.close > prevCandle.open;
    
    // Current candle should be bearish
    const currentIsBearish = currentCandle.close < currentCandle.open;
    
    // Current candle should engulf previous candle
    const engulfs = currentCandle.open > prevCandle.close && 
                    currentCandle.close < prevCandle.open;
    
    const isBearishEngulfing = prevIsBullish && currentIsBearish && engulfs;
    result.push(isBearishEngulfing);
  }
  
  return result;
}

export class BullishEngulfingPattern {
  private candles: CandleData[] = [];

  constructor(input?: EngulfingInput) {
    if (input?.candles?.length) {
      this.candles = [...input.candles];
    }
  }

  nextValue(candle: CandleData): boolean {
    this.candles.push(candle);
    
    if (this.candles.length < 2) {
      return false;
    }
    
    const prevCandle = this.candles[this.candles.length - 2];
    const currentCandle = candle;
    
    const prevIsBearish = prevCandle.close < prevCandle.open;
    const currentIsBullish = currentCandle.close > currentCandle.open;
    const engulfs = currentCandle.open < prevCandle.close && 
                    currentCandle.close > prevCandle.open;
    
    return prevIsBearish && currentIsBullish && engulfs;
  }

  static calculate = bullishengulfingpattern;
}

export class BearishEngulfingPattern {
  private candles: CandleData[] = [];

  constructor(input?: EngulfingInput) {
    if (input?.candles?.length) {
      this.candles = [...input.candles];
    }
  }

  nextValue(candle: CandleData): boolean {
    this.candles.push(candle);
    
    if (this.candles.length < 2) {
      return false;
    }
    
    const prevCandle = this.candles[this.candles.length - 2];
    const currentCandle = candle;
    
    const prevIsBullish = prevCandle.close > prevCandle.open;
    const currentIsBearish = currentCandle.close < currentCandle.open;
    const engulfs = currentCandle.open > prevCandle.close && 
                    currentCandle.close < prevCandle.open;
    
    return prevIsBullish && currentIsBearish && engulfs;
  }

  static calculate = bearishengulfingpattern;
}