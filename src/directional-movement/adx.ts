import { IndicatorInput, NumberOrUndefined } from '../types';
import { atr } from '../volatility/atr';

export interface ADXInput extends IndicatorInput {
  period: number;
  high: number[];
  low: number[];
  close: number[];
}

export function adx(input: ADXInput): number[] {
  const { period = 14, high, low, close } = input;
  
  if (high.length !== low.length || low.length !== close.length || close.length < period + 1) {
    return [];
  }

  const result: number[] = [];
  
  // Calculate +DM, -DM, and TR arrays
  const plusDM: number[] = [];
  const minusDM: number[] = [];
  const trueRanges: number[] = [];
  
  for (let i = 1; i < close.length; i++) {
    const highMove = high[i] - high[i - 1];
    const lowMove = low[i - 1] - low[i];
    
    // +DM and -DM
    if (highMove > lowMove && highMove > 0) {
      plusDM.push(highMove);
    } else {
      plusDM.push(0);
    }
    
    if (lowMove > highMove && lowMove > 0) {
      minusDM.push(lowMove);
    } else {
      minusDM.push(0);
    }
    
    // True Range
    const highLow = high[i] - low[i];
    const highPrevClose = Math.abs(high[i] - close[i - 1]);
    const lowPrevClose = Math.abs(low[i] - close[i - 1]);
    trueRanges.push(Math.max(highLow, highPrevClose, lowPrevClose));
  }
  
  // Calculate smoothed +DM, -DM, and TR
  let smoothedPlusDM = plusDM.slice(0, period).reduce((sum, val) => sum + val, 0);
  let smoothedMinusDM = minusDM.slice(0, period).reduce((sum, val) => sum + val, 0);
  let smoothedTR = trueRanges.slice(0, period).reduce((sum, val) => sum + val, 0);
  
  // Calculate first ADX
  let plusDI = (smoothedPlusDM / smoothedTR) * 100;
  let minusDI = (smoothedMinusDM / smoothedTR) * 100;
  let dx = Math.abs(plusDI - minusDI) / (plusDI + minusDI) * 100;
  
  const dxValues = [dx];
  
  // Calculate subsequent values using Wilder's smoothing
  for (let i = period; i < plusDM.length; i++) {
    smoothedPlusDM = (smoothedPlusDM * (period - 1) + plusDM[i]) / period;
    smoothedMinusDM = (smoothedMinusDM * (period - 1) + minusDM[i]) / period;
    smoothedTR = (smoothedTR * (period - 1) + trueRanges[i]) / period;
    
    plusDI = (smoothedPlusDM / smoothedTR) * 100;
    minusDI = (smoothedMinusDM / smoothedTR) * 100;
    
    if ((plusDI + minusDI) === 0) {
      dx = 0;
    } else {
      dx = Math.abs(plusDI - minusDI) / (plusDI + minusDI) * 100;
    }
    
    dxValues.push(dx);
  }
  
  // Calculate ADX as smoothed average of DX
  let adxValue = dxValues.slice(0, period).reduce((sum, val) => sum + val, 0) / period;
  result.push(adxValue);
  
  for (let i = period; i < dxValues.length; i++) {
    adxValue = (adxValue * (period - 1) + dxValues[i]) / period;
    result.push(adxValue);
  }
  
  return result;
}

export class ADX {
  private period: number;
  private highValues: number[] = [];
  private lowValues: number[] = [];
  private closeValues: number[] = [];
  private plusDM: number[] = [];
  private minusDM: number[] = [];
  private trueRanges: number[] = [];
  private dxValues: number[] = [];
  private smoothedPlusDM: number = 0;
  private smoothedMinusDM: number = 0;
  private smoothedTR: number = 0;
  private currentADX: number | undefined;
  private initialized: boolean = false;

  constructor(input: ADXInput) {
    this.period = input.period || 14;
  }

  nextValue(high: number, low: number, close: number): NumberOrUndefined {
    this.highValues.push(high);
    this.lowValues.push(low);
    this.closeValues.push(close);

    if (this.closeValues.length < 2) {
      return undefined;
    }

    // Calculate +DM, -DM, and TR
    const i = this.closeValues.length - 1;
    const highMove = this.highValues[i] - this.highValues[i - 1];
    const lowMove = this.lowValues[i - 1] - this.lowValues[i];
    
    const plusDMValue = (highMove > lowMove && highMove > 0) ? highMove : 0;
    const minusDMValue = (lowMove > highMove && lowMove > 0) ? lowMove : 0;
    
    const highLow = high - low;
    const highPrevClose = Math.abs(high - this.closeValues[i - 1]);
    const lowPrevClose = Math.abs(low - this.closeValues[i - 1]);
    const trValue = Math.max(highLow, highPrevClose, lowPrevClose);
    
    this.plusDM.push(plusDMValue);
    this.minusDM.push(minusDMValue);
    this.trueRanges.push(trValue);

    if (!this.initialized) {
      if (this.plusDM.length === this.period) {
        // Initialize smoothed values
        this.smoothedPlusDM = this.plusDM.reduce((sum, val) => sum + val, 0);
        this.smoothedMinusDM = this.minusDM.reduce((sum, val) => sum + val, 0);
        this.smoothedTR = this.trueRanges.reduce((sum, val) => sum + val, 0);
        
        const plusDI = (this.smoothedPlusDM / this.smoothedTR) * 100;
        const minusDI = (this.smoothedMinusDM / this.smoothedTR) * 100;
        const dx = Math.abs(plusDI - minusDI) / (plusDI + minusDI) * 100;
        
        this.dxValues.push(dx);
        this.initialized = true;
        return undefined; // Need more DX values for ADX
      }
      return undefined;
    }

    // Update smoothed values using Wilder's smoothing
    this.smoothedPlusDM = (this.smoothedPlusDM * (this.period - 1) + plusDMValue) / this.period;
    this.smoothedMinusDM = (this.smoothedMinusDM * (this.period - 1) + minusDMValue) / this.period;
    this.smoothedTR = (this.smoothedTR * (this.period - 1) + trValue) / this.period;
    
    const plusDI = (this.smoothedPlusDM / this.smoothedTR) * 100;
    const minusDI = (this.smoothedMinusDM / this.smoothedTR) * 100;
    
    const dx = (plusDI + minusDI === 0) ? 0 : Math.abs(plusDI - minusDI) / (plusDI + minusDI) * 100;
    this.dxValues.push(dx);

    // Calculate ADX
    if (this.currentADX === undefined) {
      if (this.dxValues.length === this.period) {
        this.currentADX = this.dxValues.reduce((sum, val) => sum + val, 0) / this.period;
        return this.currentADX;
      }
    } else {
      this.currentADX = (this.currentADX * (this.period - 1) + dx) / this.period;
      return this.currentADX;
    }

    return undefined;
  }

  getResult(): number[] {
    if (this.currentADX === undefined) {
      return [];
    }
    return [this.currentADX];
  }

  static calculate = adx;
}