import { CandleData } from '../types';

export interface HeikinAshiInput {
  candles: CandleData[];
}

export interface HeikinAshiOutput {
  open: number;
  high: number;
  low: number;
  close: number;
}

export function heikinashi(input: HeikinAshiInput): HeikinAshiOutput[] {
  const { candles } = input;
  
  if (!candles || candles.length === 0) {
    return [];
  }

  const result: HeikinAshiOutput[] = [];
  let previousHA: HeikinAshiOutput | null = null;

  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];
    const { open, high, low, close } = candle;

    let haOpen: number;
    let haClose: number;
    let haHigh: number;
    let haLow: number;

    // Heikin Ashi Close = (Open + High + Low + Close) / 4
    haClose = (open + high + low + close) / 4;

    if (previousHA === null) {
      // First candle: HA Open = (Open + Close) / 2
      haOpen = (open + close) / 2;
    } else {
      // HA Open = (Previous HA Open + Previous HA Close) / 2
      haOpen = (previousHA.open + previousHA.close) / 2;
    }

    // HA High = Max(High, HA Open, HA Close)
    haHigh = Math.max(high, haOpen, haClose);

    // HA Low = Min(Low, HA Open, HA Close)
    haLow = Math.min(low, haOpen, haClose);

    const haCandle: HeikinAshiOutput = {
      open: haOpen,
      high: haHigh,
      low: haLow,
      close: haClose
    };

    result.push(haCandle);
    previousHA = haCandle;
  }

  return result;
}

export class HeikinAshi {
  private candles: CandleData[] = [];
  private previousHA: HeikinAshiOutput | null = null;

  constructor(input?: HeikinAshiInput) {
    if (input?.candles?.length) {
      input.candles.forEach(candle => this.nextValue(candle));
    }
  }

  nextValue(candle: CandleData): HeikinAshiOutput {
    this.candles.push(candle);
    
    const { open, high, low, close } = candle;

    let haOpen: number;
    let haClose: number;
    let haHigh: number;
    let haLow: number;

    // Heikin Ashi Close = (Open + High + Low + Close) / 4
    haClose = (open + high + low + close) / 4;

    if (this.previousHA === null) {
      // First candle: HA Open = (Open + Close) / 2
      haOpen = (open + close) / 2;
    } else {
      // HA Open = (Previous HA Open + Previous HA Close) / 2
      haOpen = (this.previousHA.open + this.previousHA.close) / 2;
    }

    // HA High = Max(High, HA Open, HA Close)
    haHigh = Math.max(high, haOpen, haClose);

    // HA Low = Min(Low, HA Open, HA Close)
    haLow = Math.min(low, haOpen, haClose);

    const haCandle: HeikinAshiOutput = {
      open: haOpen,
      high: haHigh,
      low: haLow,
      close: haClose
    };

    this.previousHA = haCandle;
    return haCandle;
  }

  getResult(): HeikinAshiOutput[] {
    return heikinashi({ candles: this.candles });
  }

  static calculate = heikinashi;
}