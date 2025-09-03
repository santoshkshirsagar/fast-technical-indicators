import { IndicatorInput, NumberOrUndefined } from '../types';
import { sma } from '../moving-averages/sma';

export interface AwesomeOscillatorInput extends IndicatorInput {
  high: number[];
  low: number[];
  fastPeriod?: number;
  slowPeriod?: number;
}

export function awesomeoscillator(input: AwesomeOscillatorInput): number[] {
  const { high, low, fastPeriod = 5, slowPeriod = 34 } = input;
  
  if (high.length !== low.length || high.length < slowPeriod) {
    return [];
  }

  // Calculate midpoint prices (HL2)
  const midpoints: number[] = [];
  for (let i = 0; i < high.length; i++) {
    midpoints.push((high[i] + low[i]) / 2);
  }

  // Calculate fast and slow SMAs of midpoints
  const fastSMA = sma({ period: fastPeriod, values: midpoints });
  const slowSMA = sma({ period: slowPeriod, values: midpoints });

  // Calculate AO (Fast SMA - Slow SMA)
  const result: number[] = [];
  const startIndex = slowPeriod - fastPeriod;
  
  for (let i = 0; i < slowSMA.length; i++) {
    const aoValue = fastSMA[i + startIndex] - slowSMA[i];
    result.push(aoValue);
  }

  return result;
}

export class AwesomeOscillator {
  private fastPeriod: number;
  private slowPeriod: number;
  private highValues: number[] = [];
  private lowValues: number[] = [];
  private midpoints: number[] = [];
  private fastSMACalculator: any;
  private slowSMACalculator: any;

  constructor(input: AwesomeOscillatorInput) {
    this.fastPeriod = input.fastPeriod || 5;
    this.slowPeriod = input.slowPeriod || 34;

    // Create SMA calculators
    this.fastSMACalculator = {
      values: [] as number[],
      period: this.fastPeriod,
      sum: 0,
      nextValue: function(value: number): NumberOrUndefined {
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
    };

    this.slowSMACalculator = {
      values: [] as number[],
      period: this.slowPeriod,
      sum: 0,
      nextValue: function(value: number): NumberOrUndefined {
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
    };
  }

  nextValue(high: number, low: number): NumberOrUndefined {
    this.highValues.push(high);
    this.lowValues.push(low);

    const midpoint = (high + low) / 2;
    this.midpoints.push(midpoint);

    const fastSMA = this.fastSMACalculator.nextValue(midpoint);
    const slowSMA = this.slowSMACalculator.nextValue(midpoint);

    if (fastSMA !== undefined && slowSMA !== undefined) {
      return fastSMA - slowSMA;
    }

    return undefined;
  }

  getResult(): number[] {
    if (this.midpoints.length === 0) {
      return [];
    }

    const lastMidpoint = this.midpoints[this.midpoints.length - 1];
    const fastSMA = this.fastSMACalculator.values.length === this.fastPeriod
      ? this.fastSMACalculator.sum / this.fastPeriod
      : undefined;
    const slowSMA = this.slowSMACalculator.values.length === this.slowPeriod
      ? this.slowSMACalculator.sum / this.slowPeriod
      : undefined;

    if (fastSMA !== undefined && slowSMA !== undefined) {
      return [fastSMA - slowSMA];
    }

    return [];
  }

  static calculate = awesomeoscillator;
}