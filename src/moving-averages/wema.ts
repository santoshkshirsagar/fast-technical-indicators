import { IndicatorInput, NumberOrUndefined } from '../types';

export interface WEMAInput extends IndicatorInput {
  period: number;
  values: number[];
}

export function wema(input: WEMAInput): number[] {
  const { period, values } = input;
  
  if (period <= 0 || values.length < period) {
    return [];
  }

  const result: number[] = [];
  const alpha = 1 / period;
  
  // Initialize with SMA of first period values
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += values[i];
  }
  
  let previousWEMA = sum / period;
  result.push(previousWEMA);
  
  // Calculate subsequent WEMA values
  for (let i = period; i < values.length; i++) {
    const currentWEMA = alpha * values[i] + (1 - alpha) * previousWEMA;
    result.push(currentWEMA);
    previousWEMA = currentWEMA;
  }
  
  return result;
}

export class WEMA {
  private period: number;
  private alpha: number;
  private values: number[] = [];
  private previousWEMA: number | undefined;
  private initialized: boolean = false;

  constructor(input: WEMAInput) {
    this.period = input.period;
    this.alpha = 1 / input.period;
    
    if (input.values?.length) {
      input.values.forEach(value => this.nextValue(value));
    }
  }

  nextValue(value: number): NumberOrUndefined {
    this.values.push(value);

    if (!this.initialized) {
      if (this.values.length === this.period) {
        // Initialize with SMA
        const sum = this.values.reduce((acc, val) => acc + val, 0);
        this.previousWEMA = sum / this.period;
        this.initialized = true;
        return this.previousWEMA;
      }
      return undefined;
    }

    // Calculate WEMA using Wilder's smoothing
    const currentWEMA = this.alpha * value + (1 - this.alpha) * this.previousWEMA!;
    this.previousWEMA = currentWEMA;
    return currentWEMA;
  }

  getResult(): number[] {
    if (!this.initialized || !this.previousWEMA) {
      return [];
    }
    return [this.previousWEMA];
  }

  static calculate = wema;
}