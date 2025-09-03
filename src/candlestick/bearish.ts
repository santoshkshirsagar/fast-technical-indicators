import { CandleData } from '../types';

export interface BearishInput {
  candles: CandleData[];
}

export function bearish(input: BearishInput): boolean[] {
  const { candles } = input;
  
  if (!candles || candles.length === 0) {
    return [];
  }

  const result: boolean[] = [];

  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];
    const { open, close } = candle;

    // Simple bearish criteria: close < open
    const isBearish = close < open;

    result.push(isBearish);
  }

  return result;
}

export class Bearish {
  private candles: CandleData[] = [];

  constructor(input?: BearishInput) {
    if (input?.candles?.length) {
      this.candles = [...input.candles];
    }
  }

  nextValue(candle: CandleData): boolean {
    this.candles.push(candle);
    return candle.close < candle.open;
  }

  getResult(): boolean[] {
    return bearish({ candles: this.candles });
  }

  static calculate = bearish;
}