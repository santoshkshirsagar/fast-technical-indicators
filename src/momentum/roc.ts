import { IndicatorInput, NumberOrUndefined } from '../types';

export interface ROCInput extends IndicatorInput {
  period: number;
  values: number[];
}

export function roc(input: ROCInput): number[] {
  const { period, values } = input;
  
  if (period <= 0 || values.length <= period) {
    return [];
  }

  const result: number[] = [];
  
  for (let i = period; i < values.length; i++) {
    const currentPrice = values[i];
    const pastPrice = values[i - period];
    
    if (pastPrice === 0) {
      result.push(0);
    } else {
      const rocValue = ((currentPrice - pastPrice) / pastPrice) * 100;
      result.push(rocValue);
    }
  }
  
  return result;
}

export class ROC {
  private period: number;
  private values: number[] = [];

  constructor(input: ROCInput) {
    this.period = input.period;
    if (input.values?.length) {
      input.values.forEach(value => this.nextValue(value));
    }
  }

  nextValue(value: number): NumberOrUndefined {
    this.values.push(value);

    if (this.values.length > this.period + 1) {
      this.values.shift();
    }

    if (this.values.length === this.period + 1) {
      const currentPrice = this.values[this.values.length - 1];
      const pastPrice = this.values[0];
      
      if (pastPrice === 0) {
        return 0;
      }
      
      return ((currentPrice - pastPrice) / pastPrice) * 100;
    }
    
    return undefined;
  }

  getResult(): number[] {
    if (this.values.length < this.period + 1) {
      return [];
    }
    
    const currentPrice = this.values[this.values.length - 1];
    const pastPrice = this.values[0];
    
    if (pastPrice === 0) {
      return [0];
    }
    
    return [((currentPrice - pastPrice) / pastPrice) * 100];
  }

  static calculate = roc;
}