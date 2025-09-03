import { IndicatorInput, NumberOrUndefined } from '../types';

export interface SMAInput extends IndicatorInput {
  period: number;
  values: number[];
}

export function sma(input: SMAInput): number[] {
  const { period, values } = input;
  
  if (period <= 0 || period > values.length) {
    return [];
  }

  const result: number[] = [];
  
  for (let i = period - 1; i < values.length; i++) {
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      sum += values[j];
    }
    result.push(sum / period);
  }
  
  return result;
}

export class SMA {
  private period: number;
  private values: number[] = [];
  private sum: number = 0;

  constructor(input: SMAInput) {
    this.period = input.period;
    if (input.values?.length) {
      input.values.forEach(value => this.nextValue(value));
    }
  }

  nextValue(value: number): NumberOrUndefined {
    this.values.push(value);
    this.sum += value;

    if (this.values.length > this.period) {
      this.sum -= this.values.shift()!;
    }

    if (this.values.length === this.period) {
      return this.sum / this.period;
    }
    
    return undefined;
  }

  getResult(): number[] {
    if (this.values.length < this.period) {
      return [];
    }
    return [this.sum / this.period];
  }

  static calculate = sma;
}