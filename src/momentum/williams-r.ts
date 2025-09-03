import { IndicatorInput, NumberOrUndefined } from '../types';

export interface WilliamsRInput extends IndicatorInput {
  period: number;
  high: number[];
  low: number[];
  close: number[];
}

export function williamsr(input: WilliamsRInput): number[] {
  const { period = 14, high, low, close } = input;
  
  if (high.length !== low.length || low.length !== close.length || close.length < period) {
    return [];
  }

  const result: number[] = [];
  
  for (let i = period - 1; i < close.length; i++) {
    const highestHigh = Math.max(...high.slice(i - period + 1, i + 1));
    const lowestLow = Math.min(...low.slice(i - period + 1, i + 1));
    
    let williamsR: number;
    if (highestHigh === lowestLow) {
      williamsR = -50; // Middle value when no range
    } else {
      williamsR = ((highestHigh - close[i]) / (highestHigh - lowestLow)) * -100;
    }
    
    result.push(williamsR);
  }
  
  return result;
}

export class WilliamsR {
  private period: number;
  private highValues: number[] = [];
  private lowValues: number[] = [];
  private closeValues: number[] = [];

  constructor(input: WilliamsRInput) {
    this.period = input.period || 14;
  }

  nextValue(high: number, low: number, close: number): NumberOrUndefined {
    this.highValues.push(high);
    this.lowValues.push(low);
    this.closeValues.push(close);

    if (this.highValues.length > this.period) {
      this.highValues.shift();
      this.lowValues.shift();
      this.closeValues.shift();
    }

    if (this.highValues.length === this.period) {
      const highestHigh = Math.max(...this.highValues);
      const lowestLow = Math.min(...this.lowValues);
      const currentClose = close;
      
      if (highestHigh === lowestLow) {
        return -50;
      }
      
      return ((highestHigh - currentClose) / (highestHigh - lowestLow)) * -100;
    }
    
    return undefined;
  }

  getResult(): number[] {
    if (this.highValues.length < this.period) {
      return [];
    }
    
    const highestHigh = Math.max(...this.highValues);
    const lowestLow = Math.min(...this.lowValues);
    const currentClose = this.closeValues[this.closeValues.length - 1];
    
    if (highestHigh === lowestLow) {
      return [-50];
    }
    
    return [((highestHigh - currentClose) / (highestHigh - lowestLow)) * -100];
  }

  static calculate = williamsr;
}