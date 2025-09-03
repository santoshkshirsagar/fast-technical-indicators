import { IndicatorInput, NumberOrUndefined } from '../types';
import { sma } from './sma';

export interface EMAInput extends IndicatorInput {
  period: number;
  values: number[];
}

export function ema(input: EMAInput): number[] {
  const { period, values } = input;
  
  if (period <= 0 || values.length < period) {
    return [];
  }

  const result: number[] = [];
  const multiplier = 2 / (period + 1);
  
  // Use SMA for the first EMA value
  const firstSMA = sma({ period, values: values.slice(0, period) });
  let previousEMA = firstSMA[0];
  result.push(previousEMA);
  
  for (let i = period; i < values.length; i++) {
    const currentEMA = (values[i] - previousEMA) * multiplier + previousEMA;
    result.push(currentEMA);
    previousEMA = currentEMA;
  }
  
  return result;
}

export class EMA {
  private period: number;
  private multiplier: number;
  private previousEMA: number | undefined;
  private values: number[] = [];
  private initialized: boolean = false;

  constructor(input: EMAInput) {
    this.period = input.period;
    this.multiplier = 2 / (input.period + 1);
    
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
        this.previousEMA = sum / this.period;
        this.initialized = true;
        return this.previousEMA;
      }
      return undefined;
    }

    // Calculate EMA
    const currentEMA = (value - this.previousEMA!) * this.multiplier + this.previousEMA!;
    this.previousEMA = currentEMA;
    return currentEMA;
  }

  getResult(): number[] {
    if (!this.initialized || !this.previousEMA) {
      return [];
    }
    return [this.previousEMA];
  }

  static calculate = ema;
}