import { IndicatorInput, NumberOrUndefined } from '../types';
import { ema } from '../moving-averages/ema';

export interface ForceIndexInput extends IndicatorInput {
  period: number;
  close: number[];
  volume: number[];
}

export function forceindex(input: ForceIndexInput): number[] {
  const { period = 13, close, volume } = input;
  
  if (close.length !== volume.length || close.length < 2) {
    return [];
  }

  // Calculate raw force index values
  const rawForceIndex: number[] = [];
  
  for (let i = 1; i < close.length; i++) {
    const priceChange = close[i] - close[i - 1];
    const forceValue = priceChange * volume[i];
    rawForceIndex.push(forceValue);
  }
  
  if (period === 1) {
    return rawForceIndex;
  }
  
  // Apply EMA smoothing
  const smoothedForceIndex = ema({ period, values: rawForceIndex });
  
  return smoothedForceIndex;
}

export class ForceIndex {
  private period: number;
  private closeValues: number[] = [];
  private volumeValues: number[] = [];
  private emaCalculator: any;
  private initialized: boolean = false;

  constructor(input: ForceIndexInput) {
    this.period = input.period || 13;
    
    if (this.period === 1) {
      return; // No EMA needed for period 1
    }
    
    // Create inline EMA calculator
    const multiplier = 2 / (this.period + 1);
    this.emaCalculator = {
      values: [] as number[],
      period: this.period,
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

  nextValue(close: number, volume: number): NumberOrUndefined {
    this.closeValues.push(close);
    this.volumeValues.push(volume);

    if (this.closeValues.length < 2) {
      return undefined;
    }

    // Calculate raw force index
    const currentClose = close;
    const previousClose = this.closeValues[this.closeValues.length - 2];
    const priceChange = currentClose - previousClose;
    const forceValue = priceChange * volume;

    if (this.period === 1) {
      return forceValue;
    }

    // Apply EMA smoothing
    return this.emaCalculator.nextValue(forceValue);
  }

  getResult(): number[] {
    if (this.closeValues.length < 2) {
      return [];
    }
    
    const currentClose = this.closeValues[this.closeValues.length - 1];
    const previousClose = this.closeValues[this.closeValues.length - 2];
    const currentVolume = this.volumeValues[this.volumeValues.length - 1];
    
    const priceChange = currentClose - previousClose;
    const forceValue = priceChange * currentVolume;
    
    if (this.period === 1) {
      return [forceValue];
    }
    
    if (this.emaCalculator.previousEMA !== undefined) {
      return [this.emaCalculator.previousEMA];
    }
    
    return [];
  }

  static calculate = forceindex;
}