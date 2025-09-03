import { IndicatorInput, NumberOrUndefined } from '../types';

export interface PriceOscillatorInput extends IndicatorInput {
  fastPeriod: number;
  slowPeriod: number;
  values: number[];
  maType?: 'sma' | 'ema'; // Type of moving average to use
}

function calculateSMA(values: number[], period: number): number[] {
  if (values.length < period) {
    return [];
  }

  const result: number[] = [];
  
  for (let i = period - 1; i < values.length; i++) {
    const sum = values.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val, 0);
    result.push(sum / period);
  }
  
  return result;
}

function calculateEMA(values: number[], period: number): number[] {
  if (values.length < period) {
    return [];
  }

  const result: number[] = [];
  const multiplier = 2 / (period + 1);
  
  // Calculate initial SMA for the first EMA value
  const initialSum = values.slice(0, period).reduce((acc, val) => acc + val, 0);
  let ema = initialSum / period;
  result.push(ema);
  
  // Calculate subsequent EMA values
  for (let i = period; i < values.length; i++) {
    ema = (values[i] - ema) * multiplier + ema;
    result.push(ema);
  }
  
  return result;
}

export function priceoscillator(input: PriceOscillatorInput): number[] {
  const { fastPeriod = 12, slowPeriod = 26, values, maType = 'ema' } = input;
  
  if (values.length < slowPeriod) {
    return [];
  }

  // Calculate fast and slow moving averages
  const fastMA = maType === 'ema' ? calculateEMA(values, fastPeriod) : calculateSMA(values, fastPeriod);
  const slowMA = maType === 'ema' ? calculateEMA(values, slowPeriod) : calculateSMA(values, slowPeriod);
  
  const result: number[] = [];
  
  // Align the arrays (slow MA starts later)
  const offset = slowPeriod - fastPeriod;
  
  for (let i = 0; i < slowMA.length; i++) {
    const fastValue = fastMA[i + offset];
    const slowValue = slowMA[i];
    
    // Price Oscillator = Fast MA - Slow MA
    const oscillator = fastValue - slowValue;
    result.push(oscillator);
  }
  
  return result;
}

export class PriceOscillator {
  private fastPeriod: number;
  private slowPeriod: number;
  private maType: 'sma' | 'ema';
  private values: number[] = [];
  private fastEMA: number | undefined;
  private slowEMA: number | undefined;
  private fastMultiplier: number;
  private slowMultiplier: number;

  constructor(input: PriceOscillatorInput) {
    this.fastPeriod = input.fastPeriod || 12;
    this.slowPeriod = input.slowPeriod || 26;
    this.maType = input.maType || 'ema';
    this.fastMultiplier = 2 / (this.fastPeriod + 1);
    this.slowMultiplier = 2 / (this.slowPeriod + 1);
  }

  nextValue(value: number): NumberOrUndefined {
    this.values.push(value);

    if (this.maType === 'sma') {
      // Need at least slowPeriod values to calculate both SMAs
      if (this.values.length < this.slowPeriod) {
        return undefined;
      }

      // Keep only necessary values for SMA efficiency
      if (this.values.length > this.slowPeriod) {
        this.values.shift();
      }
      
      // Calculate SMAs
      const fastSum = this.values.slice(-this.fastPeriod).reduce((acc, val) => acc + val, 0);
      const slowSum = this.values.reduce((acc, val) => acc + val, 0);
      
      const fastSMA = fastSum / this.fastPeriod;
      const slowSMA = slowSum / this.slowPeriod;
      
      return fastSMA - slowSMA;
    } else {
      // EMA calculation
      if (this.values.length < this.slowPeriod) {
        return undefined;
      }

      if (this.fastEMA === undefined || this.slowEMA === undefined) {
        // Initialize EMAs with SMAs
        const fastSum = this.values.slice(-this.fastPeriod).reduce((acc, val) => acc + val, 0);
        const slowSum = this.values.slice(-this.slowPeriod).reduce((acc, val) => acc + val, 0);
        
        this.fastEMA = fastSum / this.fastPeriod;
        this.slowEMA = slowSum / this.slowPeriod;
        
        return this.fastEMA - this.slowEMA;
      } else {
        // Calculate EMAs
        this.fastEMA = (value - this.fastEMA) * this.fastMultiplier + this.fastEMA;
        this.slowEMA = (value - this.slowEMA) * this.slowMultiplier + this.slowEMA;
        
        return this.fastEMA - this.slowEMA;
      }
    }
  }

  getResult(): number[] {
    if (this.values.length < this.slowPeriod) {
      return [];
    }
    
    const lastResult = this.nextValue(this.values[this.values.length - 1]);
    return lastResult !== undefined ? [lastResult] : [];
  }

  static calculate = priceoscillator;
}