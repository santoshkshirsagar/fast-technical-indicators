import { IndicatorInput, NumberOrUndefined } from '../types';

export interface WMAInput extends IndicatorInput {
  period: number;
  values: number[];
}

export function wma(input: WMAInput): number[] {
  const { period, values } = input;
  
  if (period <= 0 || period > values.length) {
    return [];
  }

  const result: number[] = [];
  
  for (let i = period - 1; i < values.length; i++) {
    let weightedSum = 0;
    let weightSum = 0;
    
    for (let j = 0; j < period; j++) {
      const weight = j + 1;
      weightedSum += values[i - period + 1 + j] * weight;
      weightSum += weight;
    }
    
    result.push(weightedSum / weightSum);
  }
  
  return result;
}

export class WMA {
  private period: number;
  private values: number[] = [];

  constructor(input: WMAInput) {
    this.period = input.period;
    if (input.values?.length) {
      input.values.forEach(value => this.nextValue(value));
    }
  }

  nextValue(value: number): NumberOrUndefined {
    this.values.push(value);

    if (this.values.length > this.period) {
      this.values.shift();
    }

    if (this.values.length === this.period) {
      let weightedSum = 0;
      let weightSum = 0;
      
      for (let i = 0; i < this.period; i++) {
        const weight = i + 1;
        weightedSum += this.values[i] * weight;
        weightSum += weight;
      }
      
      return weightedSum / weightSum;
    }
    
    return undefined;
  }

  getResult(): number[] {
    if (this.values.length < this.period) {
      return [];
    }
    
    let weightedSum = 0;
    let weightSum = 0;
    
    for (let i = 0; i < this.period; i++) {
      const weight = i + 1;
      weightedSum += this.values[i] * weight;
      weightSum += weight;
    }
    
    return [weightedSum / weightSum];
  }

  static calculate = wma;
}