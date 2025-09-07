import { IndicatorInput, NumberOrUndefined } from '../types';
import { atr } from '../volatility/atr';

export interface ADXInput extends IndicatorInput {
  period: number;
  high: number[];
  low: number[];
  close: number[];
}

export interface ADXOutput {
  adx?: number;
  pdi?: number;
  mdi?: number;
}

export function adx(input: ADXInput): ADXOutput[] {
  const { period = 14, high, low, close } = input;
  
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
    
    // +DM calculation - exactly like reference
    const plusDMValue = (upMove > downMove && upMove > 0) ? upMove : 0;
    plusDM.push(plusDMValue);
    
    // -DM calculation - exactly like reference  
    const minusDMValue = (downMove > upMove && downMove > 0) ? downMove : 0;
    minusDM.push(minusDMValue);
    
    // True Range calculation
    const highLow = high[i] - low[i];
    const highPrevClose = Math.abs(high[i] - close[i - 1]);
    const lowPrevClose = Math.abs(low[i] - close[i - 1]);
    trueRanges.push(Math.max(highLow, highPrevClose, lowPrevClose));
  }
  
  // Wilder smoothing for +DM, -DM, and TR
  let smoothedPlusDM: number | undefined;
  let smoothedMinusDM: number | undefined; 
  let smoothedTR: number | undefined;
  
  // WEMA smoothing for ADX (exponent = 1/period)
  const exponent = 1 / period;
  let adxEMA: number | undefined;
  let smaSum = 0;
  let smaCount = 0;
  
  for (let i = 0; i < plusDM.length; i++) {
    // Wilder smoothing for PDM, MDM, TR
    if (smoothedPlusDM === undefined) {
      if (i < period - 1) {
        // Not enough data yet
        continue;
      } else if (i === period - 1) {
        // First calculation - sum of first 'period' values
        smoothedPlusDM = plusDM.slice(0, period).reduce((sum, val) => sum + val, 0);
        smoothedMinusDM = minusDM.slice(0, period).reduce((sum, val) => sum + val, 0);
        smoothedTR = trueRanges.slice(0, period).reduce((sum, val) => sum + val, 0);
      } else {
        // This should never happen due to the continue above
        continue;
      }
    } else {
      // Subsequent calculations - Wilder smoothing formula
      smoothedPlusDM = smoothedPlusDM! - (smoothedPlusDM! / period) + plusDM[i];
      smoothedMinusDM = smoothedMinusDM! - (smoothedMinusDM! / period) + minusDM[i];
      smoothedTR = smoothedTR! - (smoothedTR! / period) + trueRanges[i];
    }
    
    // Calculate DI and DX
    const plusDI = (smoothedPlusDM! * 100) / smoothedTR!;
    const minusDI = (smoothedMinusDM! * 100) / smoothedTR!;
    
    const diDiff = Math.abs(plusDI - minusDI);
    const diSum = plusDI + minusDI;
    const dx = (diDiff / diSum) * 100;
    
    // WEMA smoothing for ADX
    if (adxEMA === undefined) {
      // Build up SMA first
      smaSum += dx;
      smaCount++;
      
      if (smaCount === period) {
        adxEMA = smaSum / period;
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
  private highValues: number[] = [];
  private lowValues: number[] = [];
  private closeValues: number[] = [];
  private lastHigh: number | undefined;
  private lastLow: number | undefined;
  private lastClose: number | undefined;
  
  // Wilder smoothing state
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
    this.exponent = 1 / this.period;
  }

  nextValue(high: number, low: number, close: number): ADXOutput | undefined {
    this.highValues.push(high);
    this.lowValues.push(low);
    this.closeValues.push(close);

    // Need previous values to calculate DM and TR
    if (this.lastHigh === undefined || this.lastLow === undefined || this.lastClose === undefined) {
      this.lastHigh = high;
      this.lastLow = low;
      this.lastClose = close;
      return undefined;
    }

    // Calculate +DM, -DM, and TR
    const upMove = high - this.lastHigh;
    const downMove = this.lastLow - low;
    
    const plusDMValue = (upMove > downMove && upMove > 0) ? upMove : 0;
    const minusDMValue = (downMove > upMove && downMove > 0) ? downMove : 0;
    
    const highLow = high - low;
    const highPrevClose = Math.abs(high - this.lastClose);
    const lowPrevClose = Math.abs(low - this.lastClose);
    const trValue = Math.max(highLow, highPrevClose, lowPrevClose);

    // Wilder smoothing for PDM, MDM, TR
    if (this.smoothedPlusDM === undefined) {
      // Need to accumulate first 'period' values
      if (this.closeValues.length < this.period + 1) {
        this.lastHigh = high;
        this.lastLow = low;
        this.lastClose = close;
        return undefined;
      }
      
      // First calculation - sum of first 'period' values
      // We need to calculate the sum of the first period values
      let sumPlusDM = 0;
      let sumMinusDM = 0;
      let sumTR = 0;
      
      for (let i = 1; i <= this.period; i++) {
        const h = this.highValues[i];
        const l = this.lowValues[i];
        const c = this.closeValues[i];
        const prevH = this.highValues[i - 1];
        const prevL = this.lowValues[i - 1];
        const prevC = this.closeValues[i - 1];
        
        const up = h - prevH;
        const down = prevL - l;
        
        sumPlusDM += (up > down && up > 0) ? up : 0;
        sumMinusDM += (down > up && down > 0) ? down : 0;
        
        const hl = h - l;
        const hpc = Math.abs(h - prevC);
        const lpc = Math.abs(l - prevC);
        sumTR += Math.max(hl, hpc, lpc);
      }
      
      this.smoothedPlusDM = sumPlusDM;
      this.smoothedMinusDM = sumMinusDM;
      this.smoothedTR = sumTR;
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
    const dx = (diDiff / diSum) * 100;

    // WEMA smoothing for ADX
    let result: ADXOutput | undefined;
    
    if (this.adxEMA === undefined) {
      // Build up SMA first
      this.smaSum += dx;
      this.smaCount++;
      
      if (this.smaCount === this.period) {
        this.adxEMA = this.smaSum / this.period;
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

    this.lastHigh = high;
    this.lastLow = low;
    this.lastClose = close;
    
    return result;
  }

  getResult(): ADXOutput[] {
    return this.results;
  }

  static calculate = adx;
}