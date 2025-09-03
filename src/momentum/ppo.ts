import { IndicatorInput, NumberOrUndefined } from '../types';

export interface PPOInput extends IndicatorInput {
  fastPeriod: number;
  slowPeriod: number;
  signalPeriod: number;
  values: number[];
}

export interface PPOOutput {
  ppo?: number;
  signal?: number;
  histogram?: number;
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

export function ppo(input: PPOInput): PPOOutput[] {
  const { fastPeriod = 12, slowPeriod = 26, signalPeriod = 9, values } = input;
  
  if (values.length < slowPeriod) {
    return [];
  }

  // Calculate fast and slow EMAs
  const fastEMA = calculateEMA(values, fastPeriod);
  const slowEMA = calculateEMA(values, slowPeriod);
  
  const ppoValues: number[] = [];
  
  // Calculate PPO values (align arrays since slow EMA starts later)
  const offset = slowPeriod - fastPeriod;
  
  for (let i = 0; i < slowEMA.length; i++) {
    const fastValue = fastEMA[i + offset];
    const slowValue = slowEMA[i];
    
    // PPO = ((Fast EMA - Slow EMA) / Slow EMA) * 100
    const ppoValue = ((fastValue - slowValue) / slowValue) * 100;
    ppoValues.push(ppoValue);
  }
  
  // Calculate signal line (EMA of PPO)
  const signalEMA = calculateEMA(ppoValues, signalPeriod);
  
  const result: PPOOutput[] = [];
  
  // Combine PPO, signal, and histogram
  const signalOffset = signalPeriod - 1;
  
  for (let i = 0; i < signalEMA.length; i++) {
    const ppoValue = ppoValues[i + signalOffset];
    const signalValue = signalEMA[i];
    const histogramValue = ppoValue - signalValue;
    
    result.push({
      ppo: ppoValue,
      signal: signalValue,
      histogram: histogramValue
    });
  }
  
  return result;
}

export class PPO {
  private fastPeriod: number;
  private slowPeriod: number;
  private signalPeriod: number;
  private values: number[] = [];
  private fastEMA: number | undefined;
  private slowEMA: number | undefined;
  private signalEMA: number | undefined;
  private ppoValues: number[] = [];
  private fastMultiplier: number;
  private slowMultiplier: number;
  private signalMultiplier: number;

  constructor(input: PPOInput) {
    this.fastPeriod = input.fastPeriod || 12;
    this.slowPeriod = input.slowPeriod || 26;
    this.signalPeriod = input.signalPeriod || 9;
    this.fastMultiplier = 2 / (this.fastPeriod + 1);
    this.slowMultiplier = 2 / (this.slowPeriod + 1);
    this.signalMultiplier = 2 / (this.signalPeriod + 1);
  }

  nextValue(value: number): PPOOutput | undefined {
    this.values.push(value);

    // Need at least slowPeriod values to calculate PPO
    if (this.values.length < this.slowPeriod) {
      return undefined;
    }

    if (this.fastEMA === undefined || this.slowEMA === undefined) {
      // Initialize EMAs with SMAs
      const fastSum = this.values.slice(-this.fastPeriod).reduce((acc, val) => acc + val, 0);
      const slowSum = this.values.slice(-this.slowPeriod).reduce((acc, val) => acc + val, 0);
      
      this.fastEMA = fastSum / this.fastPeriod;
      this.slowEMA = slowSum / this.slowPeriod;
    } else {
      // Calculate EMAs
      this.fastEMA = (value - this.fastEMA) * this.fastMultiplier + this.fastEMA;
      this.slowEMA = (value - this.slowEMA) * this.slowMultiplier + this.slowEMA;
    }
    
    // Calculate PPO
    const ppoValue = ((this.fastEMA - this.slowEMA) / this.slowEMA) * 100;
    this.ppoValues.push(ppoValue);
    
    // Need at least signalPeriod PPO values to calculate signal
    if (this.ppoValues.length < this.signalPeriod) {
      return {
        ppo: ppoValue,
        signal: undefined,
        histogram: undefined
      };
    }
    
    if (this.signalEMA === undefined) {
      // Initialize signal EMA with SMA of PPO values
      const signalSum = this.ppoValues.slice(-this.signalPeriod).reduce((acc, val) => acc + val, 0);
      this.signalEMA = signalSum / this.signalPeriod;
    } else {
      // Calculate signal EMA
      this.signalEMA = (ppoValue - this.signalEMA) * this.signalMultiplier + this.signalEMA;
    }
    
    const histogramValue = ppoValue - this.signalEMA;
    
    // Keep PPO values array manageable
    if (this.ppoValues.length > this.signalPeriod * 2) {
      this.ppoValues.shift();
    }
    
    return {
      ppo: ppoValue,
      signal: this.signalEMA,
      histogram: histogramValue
    };
  }

  getResult(): PPOOutput[] {
    if (this.values.length < this.slowPeriod) {
      return [];
    }
    
    const lastResult = this.nextValue(this.values[this.values.length - 1]);
    return lastResult ? [lastResult] : [];
  }

  static calculate = ppo;
}