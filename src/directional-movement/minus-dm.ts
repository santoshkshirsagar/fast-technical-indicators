import { IndicatorInput } from '../types';

export interface MinusDMInput extends IndicatorInput {
  high: number[];
  low: number[];
  period?: number;
}

export function minusdm(input: MinusDMInput): number[] {
  const { high, low, period = 14 } = input;
  
  if (!high || !low || high.length !== low.length || high.length < 2) {
    return [];
  }

  const minusDMValues: number[] = [];
  
  // Calculate raw Minus DM values
  for (let i = 1; i < high.length; i++) {
    const upMove = high[i] - high[i - 1];
    const downMove = low[i - 1] - low[i];
    
    // Minus DM = downMove if downMove > upMove and downMove > 0, else 0
    let minusDM = 0;
    if (downMove > upMove && downMove > 0) {
      minusDM = downMove;
    }
    
    minusDMValues.push(minusDM);
  }

  if (minusDMValues.length < period) {
    return [];
  }

  const result: number[] = [];
  
  // Calculate initial smoothed Minus DM (simple average of first period)
  let smoothedMinusDM = minusDMValues.slice(0, period).reduce((sum, val) => sum + val, 0);
  result.push(smoothedMinusDM);
  
  // Calculate subsequent smoothed Minus DM using Wilder's smoothing
  for (let i = period; i < minusDMValues.length; i++) {
    smoothedMinusDM = ((smoothedMinusDM * (period - 1)) + minusDMValues[i]) / period;
    result.push(smoothedMinusDM);
  }

  return result;
}

export class MinusDM {
  private period: number;
  private highValues: number[] = [];
  private lowValues: number[] = [];

  constructor(input: MinusDMInput) {
    this.period = input.period || 14;
    
    if (input.high && input.low && input.high.length === input.low.length) {
      for (let i = 0; i < input.high.length; i++) {
        this.nextValue(input.high[i], input.low[i]);
      }
    }
  }

  nextValue(high: number, low: number): number | undefined {
    this.highValues.push(high);
    this.lowValues.push(low);

    const result = minusdm({
      high: this.highValues,
      low: this.lowValues,
      period: this.period
    });

    if (result.length > 0) {
      return result[result.length - 1];
    }

    return undefined;
  }

  getResult(): number[] {
    return minusdm({
      high: this.highValues,
      low: this.lowValues,
      period: this.period
    });
  }

  static calculate = minusdm;
}