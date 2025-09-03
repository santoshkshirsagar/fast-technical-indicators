import { IndicatorInput, NumberOrUndefined } from '../types';

export interface CCIInput extends IndicatorInput {
  period: number;
  high: number[];
  low: number[];
  close: number[];
}

export function cci(input: CCIInput): number[] {
  const { period = 20, high, low, close } = input;
  
  if (high.length !== low.length || low.length !== close.length || close.length < period) {
    return [];
  }

  const result: number[] = [];
  
  for (let i = period - 1; i < close.length; i++) {
    // Calculate typical prices for the period
    const typicalPrices: number[] = [];
    for (let j = i - period + 1; j <= i; j++) {
      typicalPrices.push((high[j] + low[j] + close[j]) / 3);
    }
    
    // Calculate SMA of typical prices
    const smaTP = typicalPrices.reduce((sum, tp) => sum + tp, 0) / period;
    
    // Calculate mean deviation
    const meanDeviation = typicalPrices.reduce((sum, tp) => sum + Math.abs(tp - smaTP), 0) / period;
    
    // Calculate CCI
    const currentTypicalPrice = (high[i] + low[i] + close[i]) / 3;
    let cciValue: number;
    
    if (meanDeviation === 0) {
      cciValue = 0; // Avoid division by zero
    } else {
      cciValue = (currentTypicalPrice - smaTP) / (0.015 * meanDeviation);
    }
    
    result.push(cciValue);
  }
  
  return result;
}

export class CCI {
  private period: number;
  private highValues: number[] = [];
  private lowValues: number[] = [];
  private closeValues: number[] = [];

  constructor(input: CCIInput) {
    this.period = input.period || 20;
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
      // Calculate typical prices for the period
      const typicalPrices: number[] = [];
      for (let i = 0; i < this.period; i++) {
        typicalPrices.push((this.highValues[i] + this.lowValues[i] + this.closeValues[i]) / 3);
      }
      
      // Calculate SMA of typical prices
      const smaTP = typicalPrices.reduce((sum, tp) => sum + tp, 0) / this.period;
      
      // Calculate mean deviation
      const meanDeviation = typicalPrices.reduce((sum, tp) => sum + Math.abs(tp - smaTP), 0) / this.period;
      
      // Calculate CCI
      const currentTypicalPrice = (high + low + close) / 3;
      
      if (meanDeviation === 0) {
        return 0;
      }
      
      return (currentTypicalPrice - smaTP) / (0.015 * meanDeviation);
    }
    
    return undefined;
  }

  getResult(): number[] {
    if (this.highValues.length < this.period) {
      return [];
    }
    
    // Calculate typical prices
    const typicalPrices: number[] = [];
    for (let i = 0; i < this.period; i++) {
      typicalPrices.push((this.highValues[i] + this.lowValues[i] + this.closeValues[i]) / 3);
    }
    
    // Calculate SMA of typical prices
    const smaTP = typicalPrices.reduce((sum, tp) => sum + tp, 0) / this.period;
    
    // Calculate mean deviation
    const meanDeviation = typicalPrices.reduce((sum, tp) => sum + Math.abs(tp - smaTP), 0) / this.period;
    
    // Calculate CCI
    const currentTypicalPrice = typicalPrices[typicalPrices.length - 1];
    
    if (meanDeviation === 0) {
      return [0];
    }
    
    return [(currentTypicalPrice - smaTP) / (0.015 * meanDeviation)];
  }

  static calculate = cci;
}