import { IndicatorInput, NumberOrUndefined } from '../types';

export interface ADXInput extends IndicatorInput {
  period: number;
  smoothingPeriod?: number; // For ADX smoothing, defaults to period
  high: number[];
  low: number[];
  close: number[];
}

export interface ADXOutput {
  adx?: number;
  pdi?: number;
  mdi?: number;
}

// Helper function for Wilder Smoothing (different from WEMA)
function wilderSmoothing(values: number[], period: number): number[] {
  const result: number[] = [];
  let sum = 0;
  
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      sum += values[i];
    } else if (i === period - 1) {
      sum += values[i];
      result.push(sum);
    } else {
      // Wilder smoothing: previous - (previous / period) + current
      const prev = result[result.length - 1];
      const smoothed = prev - (prev / period) + values[i];
      result.push(smoothed);
    }
  }
  
  return result;
}

export function adx(input: ADXInput): ADXOutput[] {
  const { period = 14, smoothingPeriod = period, high, low, close } = input;
  
  if (high.length !== low.length || low.length !== close.length) {
    return [];
  }

  const result: ADXOutput[] = [];
  
  // Calculate +DM, -DM, and TR arrays
  const plusDM: number[] = [];
  const minusDM: number[] = [];
  const trueRanges: number[] = [];
  
  // Start from index 1, as we need previous values for calculations
  for (let i = 1; i < close.length; i++) {
    const upMove = high[i] - high[i - 1];
    const downMove = low[i - 1] - low[i];
    
    // +DM calculation
    const plusDMValue = (upMove > downMove && upMove > 0) ? upMove : 0;
    plusDM.push(plusDMValue);
    
    // -DM calculation  
    const minusDMValue = (downMove > upMove && downMove > 0) ? downMove : 0;
    minusDM.push(minusDMValue);
    
    // True Range calculation
    const highLow = high[i] - low[i];
    const highPrevClose = Math.abs(high[i] - close[i - 1]);
    const lowPrevClose = Math.abs(low[i] - close[i - 1]);
    trueRanges.push(Math.max(highLow, highPrevClose, lowPrevClose));
  }
  
  // Apply Wilder smoothing to +DM, -DM, and TR
  const smoothedPlusDM = wilderSmoothing(plusDM, period);
  const smoothedMinusDM = wilderSmoothing(minusDM, period);
  const smoothedTR = wilderSmoothing(trueRanges, period);
  
  // Calculate DX values
  const dxValues: number[] = [];
  
  for (let i = 0; i < smoothedPlusDM.length; i++) {
    const plusDI = (smoothedPlusDM[i] * 100) / smoothedTR[i];
    const minusDI = (smoothedMinusDM[i] * 100) / smoothedTR[i];
    
    const diDiff = Math.abs(plusDI - minusDI);
    const diSum = plusDI + minusDI;
    const dx = diSum !== 0 ? (diDiff / diSum) * 100 : 0;
    
    dxValues.push(dx);
  }
  
  // WEMA smoothing for ADX using smoothingPeriod
  const exponent = 1 / smoothingPeriod;
  let adxEMA: number | undefined;
  let smaSum = 0;
  let smaCount = 0;
  
  for (let i = 0; i < dxValues.length; i++) {
    const dx = dxValues[i];
    const plusDI = (smoothedPlusDM[i] * 100) / smoothedTR[i];
    const minusDI = (smoothedMinusDM[i] * 100) / smoothedTR[i];
    
    // WEMA smoothing for ADX
    if (adxEMA === undefined) {
      // Build up SMA first
      smaSum += dx;
      smaCount++;
      
      if (smaCount === smoothingPeriod) {
        adxEMA = smaSum / smoothingPeriod;
        result.push({
          adx: adxEMA,
          pdi: plusDI,
          mdi: minusDI
        });
      }
    } else {
      // WEMA formula: ((current - prev) * exponent) + prev
      adxEMA = ((dx - adxEMA) * exponent) + adxEMA;
      result.push({
        adx: adxEMA,
        pdi: plusDI,
        mdi: minusDI
      });
    }
  }
  
  return result;
}

export class ADX {
  private period: number;
  private smoothingPeriod: number;
  private highValues: number[] = [];
  private lowValues: number[] = [];
  private closeValues: number[] = [];
  
  // For streaming Wilder smoothing state
  private plusDMValues: number[] = [];
  private minusDMValues: number[] = [];
  private trValues: number[] = [];
  
  private smoothedPlusDM: number | undefined;
  private smoothedMinusDM: number | undefined;
  private smoothedTR: number | undefined;
  
  // WEMA state for ADX
  private exponent: number;
  private adxEMA: number | undefined;
  private smaSum: number = 0;
  private smaCount: number = 0;
  
  private results: ADXOutput[] = [];

  constructor(input: ADXInput) {
    this.period = input.period || 14;
    this.smoothingPeriod = input.smoothingPeriod || this.period;
    this.exponent = 1 / this.smoothingPeriod;
  }

  nextValue(high: number, low: number, close: number): ADXOutput | undefined {
    this.highValues.push(high);
    this.lowValues.push(low);
    this.closeValues.push(close);

    // Need at least 2 values to calculate DM and TR
    if (this.highValues.length < 2) {
      return undefined;
    }

    // Calculate +DM, -DM, and TR for the current period
    const prevHigh = this.highValues[this.highValues.length - 2];
    const prevLow = this.lowValues[this.lowValues.length - 2];
    const prevClose = this.closeValues[this.closeValues.length - 2];
    
    const upMove = high - prevHigh;
    const downMove = prevLow - low;
    
    const plusDMValue = (upMove > downMove && upMove > 0) ? upMove : 0;
    const minusDMValue = (downMove > upMove && downMove > 0) ? downMove : 0;
    
    const highLow = high - low;
    const highPrevClose = Math.abs(high - prevClose);
    const lowPrevClose = Math.abs(low - prevClose);
    const trValue = Math.max(highLow, highPrevClose, lowPrevClose);
    
    // Store raw values for Wilder smoothing
    this.plusDMValues.push(plusDMValue);
    this.minusDMValues.push(minusDMValue);
    this.trValues.push(trValue);

    // Wilder smoothing for +DM, -DM, and TR
    if (this.smoothedPlusDM === undefined) {
      // Need enough values for first smoothed calculation
      if (this.plusDMValues.length < this.period) {
        return undefined;
      }
      
      // First calculation - sum of first 'period' values
      this.smoothedPlusDM = this.plusDMValues.slice(0, this.period).reduce((sum, val) => sum + val, 0);
      this.smoothedMinusDM = this.minusDMValues.slice(0, this.period).reduce((sum, val) => sum + val, 0);
      this.smoothedTR = this.trValues.slice(0, this.period).reduce((sum, val) => sum + val, 0);
    } else {
      // Subsequent calculations - Wilder smoothing formula
      this.smoothedPlusDM = this.smoothedPlusDM! - (this.smoothedPlusDM! / this.period) + plusDMValue;
      this.smoothedMinusDM = this.smoothedMinusDM! - (this.smoothedMinusDM! / this.period) + minusDMValue;
      this.smoothedTR = this.smoothedTR! - (this.smoothedTR! / this.period) + trValue;
    }

    // Calculate DI and DX
    const plusDI = (this.smoothedPlusDM! * 100) / this.smoothedTR!;
    const minusDI = (this.smoothedMinusDM! * 100) / this.smoothedTR!;
    
    const diDiff = Math.abs(plusDI - minusDI);
    const diSum = plusDI + minusDI;
    const dx = diSum !== 0 ? (diDiff / diSum) * 100 : 0;

    // WEMA smoothing for ADX using smoothingPeriod
    let result: ADXOutput | undefined;
    
    if (this.adxEMA === undefined) {
      // Build up SMA first
      this.smaSum += dx;
      this.smaCount++;
      
      if (this.smaCount === this.smoothingPeriod) {
        this.adxEMA = this.smaSum / this.smoothingPeriod;
        result = {
          adx: this.adxEMA,
          pdi: plusDI,
          mdi: minusDI
        };
      }
    } else {
      // WEMA formula: ((current - prev) * exponent) + prev
      this.adxEMA = ((dx - this.adxEMA) * this.exponent) + this.adxEMA;
      result = {
        adx: this.adxEMA,
        pdi: plusDI,
        mdi: minusDI
      };
    }

    if (result) {
      this.results.push(result);
    }
    
    return result;
  }

  getResult(): ADXOutput[] {
    return this.results;
  }

  static calculate = adx;
}