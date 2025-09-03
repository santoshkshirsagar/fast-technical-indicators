import { IndicatorInput, NumberOrUndefined } from '../types';

export interface WilderSmoothingInput extends IndicatorInput {
  values: number[];
  period: number;
}

export function wildersmoothing(input: WilderSmoothingInput): number[] {
  const { values, period } = input;
  
  if (!values || values.length < period || period <= 0) {
    return [];
  }

  const result: number[] = [];
  
  // Calculate initial smoothed value (simple average of first period)
  let smoothedValue = values.slice(0, period).reduce((sum, val) => sum + val, 0) / period;
  result.push(smoothedValue);
  
  // Calculate subsequent smoothed values using Wilder's smoothing formula:
  // Smoothed Value = ((Previous Smoothed Value * (period - 1)) + Current Value) / period
  for (let i = period; i < values.length; i++) {
    smoothedValue = ((smoothedValue * (period - 1)) + values[i]) / period;
    result.push(smoothedValue);
  }

  return result;
}

export class WilderSmoothing {
  private period: number;
  private values: number[] = [];
  private smoothedValue: number | undefined;
  private initialized: boolean = false;

  constructor(input: WilderSmoothingInput) {
    this.period = input.period;
    
    if (input.values?.length) {
      input.values.forEach(value => this.nextValue(value));
    }
  }

  nextValue(value: number): NumberOrUndefined {
    this.values.push(value);

    if (this.values.length < this.period) {
      return undefined;
    }

    if (!this.initialized) {
      // Initialize with simple average of first period
      this.smoothedValue = this.values.slice(-this.period).reduce((sum, val) => sum + val, 0) / this.period;
      this.initialized = true;
      return this.smoothedValue;
    }

    // Apply Wilder's smoothing
    this.smoothedValue = ((this.smoothedValue! * (this.period - 1)) + value) / this.period;
    return this.smoothedValue;
  }

  getResult(): number[] {
    return wildersmoothing({
      values: this.values,
      period: this.period
    });
  }

  static calculate = wildersmoothing;
}