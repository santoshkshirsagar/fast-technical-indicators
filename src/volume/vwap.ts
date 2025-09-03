import { IndicatorInput, NumberOrUndefined, CandleData } from '../types';

export interface VWAPInput {
  high: number[];
  low: number[];
  close: number[];
  volume: number[];
  period?: number; // For rolling VWAP, optional
}

export function vwap(input: VWAPInput): number[] {
  const { high, low, close, volume, period } = input;
  
  if (high.length !== low.length || low.length !== close.length || close.length !== volume.length) {
    return [];
  }

  const result: number[] = [];
  
  if (period && period > 0) {
    // Rolling VWAP
    for (let i = period - 1; i < close.length; i++) {
      let totalPV = 0;
      let totalVolume = 0;
      
      for (let j = i - period + 1; j <= i; j++) {
        const typicalPrice = (high[j] + low[j] + close[j]) / 3;
        const pv = typicalPrice * volume[j];
        totalPV += pv;
        totalVolume += volume[j];
      }
      
      const vwapValue = totalVolume === 0 ? 0 : totalPV / totalVolume;
      result.push(vwapValue);
    }
  } else {
    // Cumulative VWAP from start
    let cumulativePV = 0;
    let cumulativeVolume = 0;
    
    for (let i = 0; i < close.length; i++) {
      const typicalPrice = (high[i] + low[i] + close[i]) / 3;
      const pv = typicalPrice * volume[i];
      
      cumulativePV += pv;
      cumulativeVolume += volume[i];
      
      const vwapValue = cumulativeVolume === 0 ? 0 : cumulativePV / cumulativeVolume;
      result.push(vwapValue);
    }
  }
  
  return result;
}

export class VWAP {
  private period?: number;
  private highValues: number[] = [];
  private lowValues: number[] = [];
  private closeValues: number[] = [];
  private volumeValues: number[] = [];
  private cumulativePV: number = 0;
  private cumulativeVolume: number = 0;

  constructor(input?: VWAPInput & { period?: number }) {
    this.period = input?.period;
    
    if (input?.high?.length) {
      const { high, low, close, volume } = input;
      for (let i = 0; i < Math.min(high.length, low.length, close.length, volume.length); i++) {
        this.nextValue(high[i], low[i], close[i], volume[i]);
      }
    }
  }

  nextValue(high: number, low: number, close: number, volume: number): NumberOrUndefined {
    this.highValues.push(high);
    this.lowValues.push(low);
    this.closeValues.push(close);
    this.volumeValues.push(volume);
    
    const typicalPrice = (high + low + close) / 3;
    const pv = typicalPrice * volume;
    
    if (this.period && this.period > 0) {
      // Rolling VWAP
      if (this.highValues.length > this.period) {
        this.highValues.shift();
        this.lowValues.shift();
        this.closeValues.shift();
        this.volumeValues.shift();
      }
      
      if (this.highValues.length === this.period) {
        let totalPV = 0;
        let totalVolume = 0;
        
        for (let i = 0; i < this.period; i++) {
          const tp = (this.highValues[i] + this.lowValues[i] + this.closeValues[i]) / 3;
          totalPV += tp * this.volumeValues[i];
          totalVolume += this.volumeValues[i];
        }
        
        return totalVolume === 0 ? 0 : totalPV / totalVolume;
      }
    } else {
      // Cumulative VWAP
      this.cumulativePV += pv;
      this.cumulativeVolume += volume;
      
      return this.cumulativeVolume === 0 ? 0 : this.cumulativePV / this.cumulativeVolume;
    }
    
    return undefined;
  }

  getResult(): number[] {
    if (this.period && this.period > 0) {
      if (this.highValues.length < this.period) {
        return [];
      }
      
      let totalPV = 0;
      let totalVolume = 0;
      
      for (let i = 0; i < this.highValues.length; i++) {
        const tp = (this.highValues[i] + this.lowValues[i] + this.closeValues[i]) / 3;
        totalPV += tp * this.volumeValues[i];
        totalVolume += this.volumeValues[i];
      }
      
      return [totalVolume === 0 ? 0 : totalPV / totalVolume];
    } else {
      return [this.cumulativeVolume === 0 ? 0 : this.cumulativePV / this.cumulativeVolume];
    }
  }

  static calculate = vwap;
}