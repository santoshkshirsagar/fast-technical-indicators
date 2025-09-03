import { CandleData } from '../types';

export interface BullishInput {
  candles: CandleData[];
}

export function bullish(input: BullishInput): boolean[] {
  const { candles } = input;
  
  if (!candles || candles.length === 0) {
    return [];
  }

  const result: boolean[] = [];

  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];
    const { open, close } = candle;

    // Simple bullish criteria: close > open
    const isBullish = close > open;

    result.push(isBullish);
  }

  return result;
}

export class Bullish {
  private candles: CandleData[] = [];

  constructor(input?: BullishInput) {
    if (input?.candles?.length) {
      this.candles = [...input.candles];
    }
  }

  nextValue(candle: CandleData): boolean {
    this.candles.push(candle);
    return candle.close > candle.open;
  }

  getResult(): boolean[] {
    return bullish({ candles: this.candles });
  }

  static calculate = bullish;
}