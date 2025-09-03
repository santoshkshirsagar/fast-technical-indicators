import { IndicatorInput, NumberOrUndefined } from '../types';
import { ema } from '../moving-averages/ema';

export interface TRIXInput extends IndicatorInput {
  period: number;
  values: number[];
}

export function trix(input: TRIXInput): number[] {
  const { period = 14, values } = input;
  
  if (values.length < period * 3) {
    return [];
  }

  // First EMA
  const ema1 = ema({ period, values });
  
  // Second EMA of first EMA
  const ema2 = ema({ period, values: ema1 });
  
  // Third EMA of second EMA  
  const ema3 = ema({ period, values: ema2 });
  
  // Calculate TRIX: Rate of change of triple EMA
  const result: number[] = [];
  
  for (let i = 1; i < ema3.length; i++) {
    const currentValue = ema3[i];
    const previousValue = ema3[i - 1];
    
    if (previousValue === 0) {
      result.push(0);
    } else {
      const trixValue = ((currentValue - previousValue) / previousValue) * 10000;
      result.push(trixValue);
    }
  }
  
  return result;
}

export class TRIX {
  private period: number;
  private ema1Calculator: any;
  private ema2Calculator: any;
  private ema3Calculator: any;
  private previousTripleEMA: number | undefined;
  private initialized: boolean = false;

  constructor(input: TRIXInput) {
    this.period = input.period || 14;
    
    // Create inline EMA calculators to avoid circular imports
    this.ema1Calculator = this.createEMACalculator(this.period);
    this.ema2Calculator = this.createEMACalculator(this.period);
    this.ema3Calculator = this.createEMACalculator(this.period);
    
    if (input.values?.length) {
      input.values.forEach(value => this.nextValue(value));
    }
  }

  private createEMACalculator(period: number) {
    const multiplier = 2 / (period + 1);
    return {
      values: [] as number[],
      period,
      multiplier,
      previousEMA: undefined as number | undefined,
      initialized: false,
      nextValue: function(value: number): NumberOrUndefined {
        this.values.push(value);
        
        if (!this.initialized) {
          if (this.values.length === this.period) {
            const sum = this.values.reduce((acc: number, val: number) => acc + val, 0);
            this.previousEMA = sum / this.period;
            this.initialized = true;
            return this.previousEMA;
          }
          return undefined;
        }
        
        const currentEMA = (value - this.previousEMA!) * this.multiplier + this.previousEMA!;
        this.previousEMA = currentEMA;
        return currentEMA;
      }
    };
  }

  nextValue(value: number): NumberOrUndefined {
    const ema1Value = this.ema1Calculator.nextValue(value);
    if (ema1Value === undefined) return undefined;
    
    const ema2Value = this.ema2Calculator.nextValue(ema1Value);
    if (ema2Value === undefined) return undefined;
    
    const ema3Value = this.ema3Calculator.nextValue(ema2Value);
    if (ema3Value === undefined) return undefined;
    
    if (!this.initialized) {
      this.previousTripleEMA = ema3Value;
      this.initialized = true;
      return undefined; // Need at least 2 values to calculate rate of change
    }
    
    const currentTripleEMA = ema3Value;
    let trixValue: number;
    
    if (this.previousTripleEMA === 0) {
      trixValue = 0;
    } else {
      trixValue = ((currentTripleEMA - this.previousTripleEMA!) / this.previousTripleEMA!) * 10000;
    }
    
    this.previousTripleEMA = currentTripleEMA;
    return trixValue;
  }

  getResult(): number[] {
    if (!this.initialized || this.previousTripleEMA === undefined) {
      return [];
    }
    
    // Return the last calculated TRIX value
    const currentTripleEMA = this.ema3Calculator.previousEMA;
    if (currentTripleEMA === undefined) return [];
    
    let trixValue: number;
    if (this.previousTripleEMA === 0) {
      trixValue = 0;
    } else {
      trixValue = ((currentTripleEMA - this.previousTripleEMA) / this.previousTripleEMA) * 10000;
    }
    
    return [trixValue];
  }

  static calculate = trix;
}