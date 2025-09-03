import { IndicatorInput, NumberOrUndefined } from '../types';

export interface UltimateOscillatorInput extends IndicatorInput {
  high: number[];
  low: number[];
  close: number[];
  period1?: number;
  period2?: number;
  period3?: number;
}

function trueRange(high: number, low: number, previousClose: number): number {
  const highLow = high - low;
  const highPrevClose = Math.abs(high - previousClose);
  const lowPrevClose = Math.abs(low - previousClose);
  
  return Math.max(highLow, highPrevClose, lowPrevClose);
}

function buyingPressure(high: number, low: number, close: number): number {
  return close - Math.min(low, close);
}

function calculateSum(values: number[], period: number, startIndex: number): number {
  let sum = 0;
  for (let i = Math.max(0, startIndex - period + 1); i <= startIndex; i++) {
    sum += values[i];
  }
  return sum;
}

export function ultimateoscillator(input: UltimateOscillatorInput): number[] {
  const { high, low, close, period1 = 7, period2 = 14, period3 = 28 } = input;
  
  if (high.length !== low.length || low.length !== close.length || close.length < period3 + 1) {
    return [];
  }

  const result: number[] = [];
  const trueRanges: number[] = [];
  const buyingPressures: number[] = [];
  
  // Calculate true ranges and buying pressures (skip first value since we need previous close)
  for (let i = 1; i < close.length; i++) {
    const tr = trueRange(high[i], low[i], close[i - 1]);
    const bp = buyingPressure(high[i], low[i], close[i]);
    
    trueRanges.push(tr);
    buyingPressures.push(bp);
  }
  
  // Calculate Ultimate Oscillator starting from period3
  for (let i = period3 - 1; i < trueRanges.length; i++) {
    // Calculate sums for each period
    const bp1Sum = calculateSum(buyingPressures, period1, i);
    const tr1Sum = calculateSum(trueRanges, period1, i);
    const raw1 = bp1Sum / tr1Sum;
    
    const bp2Sum = calculateSum(buyingPressures, period2, i);
    const tr2Sum = calculateSum(trueRanges, period2, i);
    const raw2 = bp2Sum / tr2Sum;
    
    const bp3Sum = calculateSum(buyingPressures, period3, i);
    const tr3Sum = calculateSum(trueRanges, period3, i);
    const raw3 = bp3Sum / tr3Sum;
    
    // Calculate Ultimate Oscillator
    const uo = 100 * (4 * raw1 + 2 * raw2 + raw3) / (4 + 2 + 1);
    result.push(uo);
  }
  
  return result;
}

export class UltimateOscillator {
  private period1: number;
  private period2: number;
  private period3: number;
  private highValues: number[] = [];
  private lowValues: number[] = [];
  private closeValues: number[] = [];
  private trueRanges: number[] = [];
  private buyingPressures: number[] = [];

  constructor(input: UltimateOscillatorInput) {
    this.period1 = input.period1 || 7;
    this.period2 = input.period2 || 14;
    this.period3 = input.period3 || 28;
  }

  nextValue(high: number, low: number, close: number): NumberOrUndefined {
    this.highValues.push(high);
    this.lowValues.push(low);
    this.closeValues.push(close);

    // Need at least 2 closes to calculate true range
    if (this.closeValues.length < 2) {
      return undefined;
    }

    // Calculate true range and buying pressure
    const previousClose = this.closeValues[this.closeValues.length - 2];
    const tr = trueRange(high, low, previousClose);
    const bp = buyingPressure(high, low, close);
    
    this.trueRanges.push(tr);
    this.buyingPressures.push(bp);

    // Need at least period3 values to calculate UO
    if (this.trueRanges.length < this.period3) {
      return undefined;
    }

    // Keep only necessary values for efficiency
    const maxPeriod = Math.max(this.period1, this.period2, this.period3);
    if (this.trueRanges.length > maxPeriod) {
      this.trueRanges.shift();
      this.buyingPressures.shift();
      this.highValues.shift();
      this.lowValues.shift();
      this.closeValues.shift();
    }
    
    // Calculate sums for each period
    const currentIndex = this.trueRanges.length - 1;
    
    const bp1Sum = calculateSum(this.buyingPressures, this.period1, currentIndex);
    const tr1Sum = calculateSum(this.trueRanges, this.period1, currentIndex);
    const raw1 = bp1Sum / tr1Sum;
    
    const bp2Sum = calculateSum(this.buyingPressures, this.period2, currentIndex);
    const tr2Sum = calculateSum(this.trueRanges, this.period2, currentIndex);
    const raw2 = bp2Sum / tr2Sum;
    
    const bp3Sum = calculateSum(this.buyingPressures, this.period3, currentIndex);
    const tr3Sum = calculateSum(this.trueRanges, this.period3, currentIndex);
    const raw3 = bp3Sum / tr3Sum;
    
    // Calculate Ultimate Oscillator
    const uo = 100 * (4 * raw1 + 2 * raw2 + raw3) / (4 + 2 + 1);
    return uo;
  }

  getResult(): number[] {
    if (this.trueRanges.length < this.period3) {
      return [];
    }
    
    const lastResult = this.nextValue(
      this.highValues[this.highValues.length - 1],
      this.lowValues[this.lowValues.length - 1],
      this.closeValues[this.closeValues.length - 1]
    );
    
    return lastResult !== undefined ? [lastResult] : [];
  }

  static calculate = ultimateoscillator;
}