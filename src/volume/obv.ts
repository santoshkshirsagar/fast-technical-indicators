import { IndicatorInput, NumberOrUndefined, CandleData } from '../types';

export interface OBVInput {
  close: number[];
  volume: number[];
}

export function obv(input: OBVInput): number[] {
  const { close, volume } = input;
  
  if (close.length !== volume.length || close.length < 2) {
    return [];
  }

  const result: number[] = [];
  let cumulativeVolume = 0; // Start with 0
  
  for (let i = 1; i < close.length; i++) {
    if (close[i] > close[i - 1]) {
      // Price up, add volume
      cumulativeVolume += volume[i];
    } else if (close[i] < close[i - 1]) {
      // Price down, subtract volume
      cumulativeVolume -= volume[i];
    }
    // If price unchanged, volume doesn't change cumulative total
    
    result.push(cumulativeVolume);
  }
  
  return result;
}

export class OBV {
  private closeValues: number[] = [];
  private volumeValues: number[] = [];
  private cumulativeVolume: number = 0;
  private initialized: boolean = false;

  constructor(input?: { close?: number[]; volume?: number[] }) {
    if (input?.close?.length && input?.volume?.length) {
      for (let i = 0; i < Math.min(input.close.length, input.volume.length); i++) {
        this.nextValue(input.close[i], input.volume[i]);
      }
    }
  }

  nextValue(close: number, volume: number): NumberOrUndefined {
    this.closeValues.push(close);
    this.volumeValues.push(volume);

    if (!this.initialized) {
      this.cumulativeVolume = 0; // Start with 0
      this.initialized = true;
      return undefined; // Don't return value for first data point
    }

    const previousClose = this.closeValues[this.closeValues.length - 2];
    
    if (close > previousClose) {
      this.cumulativeVolume += volume;
    } else if (close < previousClose) {
      this.cumulativeVolume -= volume;
    }
    // No change if price unchanged
    
    return this.cumulativeVolume;
  }

  getResult(): number[] {
    if (!this.initialized) {
      return [];
    }
    return [this.cumulativeVolume];
  }

  static calculate = obv;
}