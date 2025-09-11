import { IndicatorInput } from '../types';

export interface DMIInput extends IndicatorInput {
  period: number;
  adxSmoothing: number;
  high: number[];
  low: number[];
  close: number[];
}

export interface DMIOutput {
  pdi: number;
  mdi: number;
  adx: number;
}

// Helper function for Wilder Smoothing (RMA - TradingView style)
function wilderSmoothing(values: number[], period: number): number[] {
  const result: number[] = [];
  
  for (let i = 0; i < values.length; i++) {
    if (i < period) {
      // For the first 'period' values, use simple average
      const sum = values.slice(0, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / (i + 1));
    } else {
      // Wilder smoothing: (previous * (period - 1) + current) / period
      const prev = result[i - 1];
      const smoothed = (prev * (period - 1) + values[i]) / period;
      result.push(smoothed);
    }
  }
  
  return result;
}

export function dmi(input: DMIInput): DMIOutput[] {
  const { period = 14, adxSmoothing = 14, high, low, close } = input;
  
  if (high.length !== low.length || low.length !== close.length) {
    return [];
  }

  const result: DMIOutput[] = [];
  
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
    const plusDI = smoothedTR[i] !== 0 ? (smoothedPlusDM[i] * 100) / smoothedTR[i] : 0;
    const minusDI = smoothedTR[i] !== 0 ? (smoothedMinusDM[i] * 100) / smoothedTR[i] : 0;
    
    const diDiff = Math.abs(plusDI - minusDI);
    const diSum = plusDI + minusDI;
    const dx = diSum !== 0 ? (diDiff / diSum) * 100 : 0;
    
    dxValues.push(dx);
  }
  
  // Apply Wilder smoothing to DX for ADX
  const smoothedDX = wilderSmoothing(dxValues, adxSmoothing);
  
  // Build final results
  for (let i = 0; i < smoothedDX.length; i++) {
    const plusDI = smoothedTR[i] !== 0 ? (smoothedPlusDM[i] * 100) / smoothedTR[i] : 0;
    const minusDI = smoothedTR[i] !== 0 ? (smoothedMinusDM[i] * 100) / smoothedTR[i] : 0;
    
    result.push({
      pdi: plusDI,
      mdi: minusDI,
      adx: smoothedDX[i]
    });
  }
  
  return result;
}

export class DMI {
  private period: number;
  private adxSmoothing: number;
  private highValues: number[] = [];
  private lowValues: number[] = [];
  private closeValues: number[] = [];
  
  // For streaming Wilder smoothing state
  private plusDMValues: number[] = [];
  private minusDMValues: number[] = [];
  private trValues: number[] = [];
  private dxValues: number[] = [];
  
  private smoothedPlusDM: number | undefined;
  private smoothedMinusDM: number | undefined;
  private smoothedTR: number | undefined;
  private smoothedDX: number | undefined;
  
  private results: DMIOutput[] = [];

  constructor(input: DMIInput) {
    this.period = input.period || 14;
    this.adxSmoothing = input.adxSmoothing || 14;
  }

  nextValue(high: number, low: number, close: number): DMIOutput | undefined {
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
    
    // Store raw values
    this.plusDMValues.push(plusDMValue);
    this.minusDMValues.push(minusDMValue);
    this.trValues.push(trValue);

    // Apply Wilder smoothing to +DM, -DM, and TR
    if (this.plusDMValues.length < this.period) {
      return undefined;
    } else if (this.plusDMValues.length === this.period) {
      // First calculation - use all values
      const sum1 = this.plusDMValues.reduce((a, b) => a + b, 0);
      const sum2 = this.minusDMValues.reduce((a, b) => a + b, 0);
      const sum3 = this.trValues.reduce((a, b) => a + b, 0);
      this.smoothedPlusDM = sum1 / this.period;
      this.smoothedMinusDM = sum2 / this.period;
      this.smoothedTR = sum3 / this.period;
    } else {
      // Subsequent calculations - Wilder smoothing
      this.smoothedPlusDM = (this.smoothedPlusDM! * (this.period - 1) + plusDMValue) / this.period;
      this.smoothedMinusDM = (this.smoothedMinusDM! * (this.period - 1) + minusDMValue) / this.period;
      this.smoothedTR = (this.smoothedTR! * (this.period - 1) + trValue) / this.period;
    }

    // Calculate +DI and -DI
    const plusDI = this.smoothedTR! !== 0 ? (this.smoothedPlusDM! * 100) / this.smoothedTR! : 0;
    const minusDI = this.smoothedTR! !== 0 ? (this.smoothedMinusDM! * 100) / this.smoothedTR! : 0;
    
    // Calculate DX
    const diDiff = Math.abs(plusDI - minusDI);
    const diSum = plusDI + minusDI;
    const dx = diSum !== 0 ? (diDiff / diSum) * 100 : 0;
    
    this.dxValues.push(dx);

    // Apply Wilder smoothing to DX for ADX
    if (this.dxValues.length < this.adxSmoothing) {
      const result: DMIOutput = {
        pdi: plusDI,
        mdi: minusDI,
        adx: 0  // ADX not ready yet
      };
      this.results.push(result);
      return result;
    } else if (this.dxValues.length === this.adxSmoothing) {
      // First ADX calculation
      const dxSum = this.dxValues.reduce((a, b) => a + b, 0);
      this.smoothedDX = dxSum / this.adxSmoothing;
    } else {
      // Subsequent ADX calculations - Wilder smoothing
      this.smoothedDX = (this.smoothedDX! * (this.adxSmoothing - 1) + dx) / this.adxSmoothing;
    }

    const result: DMIOutput = {
      pdi: plusDI,
      mdi: minusDI,
      adx: this.smoothedDX || 0
    };

    this.results.push(result);
    return result;
  }

  getResult(): DMIOutput[] {
    return this.results;
  }

  static calculate = dmi;
}