import { IndicatorInput, NumberOrUndefined } from '../types';

export interface ATRInput extends IndicatorInput {
  period: number;
  high: number[];
  low: number[];
  close: number[];
}

function trueRange(high: number, low: number, previousClose: number): number {
  const highLow = high - low;
  const highPrevClose = Math.abs(high - previousClose);
  const lowPrevClose = Math.abs(low - previousClose);
  
  return Math.max(highLow, highPrevClose, lowPrevClose);
}

export function atr(input: ATRInput): number[] {
  const { period = 14, high, low, close } = input;
  
  if (high.length !== low.length || low.length !== close.length || close.length < period + 1) {
    return [];
  }

  const result: number[] = [];
  const trueRanges: number[] = [];
  
  // Calculate true ranges (skip first value since we need previous close)
  for (let i = 1; i < close.length; i++) {
    const tr = trueRange(high[i], low[i], close[i - 1]);
    trueRanges.push(tr);
  }
  
  // Calculate initial ATR using simple average
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += trueRanges[i];
  }
  let currentATR = sum / period;
  result.push(currentATR);
  
  // Calculate subsequent ATR using Wilder's smoothing
  for (let i = period; i < trueRanges.length; i++) {
    currentATR = ((currentATR * (period - 1)) + trueRanges[i]) / period;
    result.push(currentATR);
  }
  
  return result;
}

export class ATR {
  private period: number;
  private highValues: number[] = [];
  private lowValues: number[] = [];
  private closeValues: number[] = [];
  private trueRanges: number[] = [];
  private currentATR: number | undefined;
  private initialized: boolean = false;

  constructor(input: ATRInput) {
    this.period = input.period || 14;
  }

  nextValue(high: number, low: number, close: number): NumberOrUndefined {
    this.highValues.push(high);
    this.lowValues.push(low);
    this.closeValues.push(close);

    // Need at least 2 closes to calculate true range
    if (this.closeValues.length < 2) {
      return undefined;
    }

    // Calculate true range
    const previousClose = this.closeValues[this.closeValues.length - 2];
    const tr = trueRange(high, low, previousClose);
    this.trueRanges.push(tr);

    if (!this.initialized) {
      if (this.trueRanges.length === this.period) {
        // Calculate initial ATR using simple average
        const sum = this.trueRanges.reduce((acc, tr) => acc + tr, 0);
        this.currentATR = sum / this.period;
        this.initialized = true;
        return this.currentATR;
      }
      return undefined;
    }

    // Calculate ATR using Wilder's smoothing
    this.currentATR = ((this.currentATR! * (this.period - 1)) + tr) / this.period;
    return this.currentATR;
  }

  getResult(): number[] {
    if (!this.initialized || this.currentATR === undefined) {
      return [];
    }
    return [this.currentATR];
  }

  static calculate = atr;
}