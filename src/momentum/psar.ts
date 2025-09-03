import { IndicatorInput, NumberOrUndefined } from '../types';

export interface PSARInput extends IndicatorInput {
  high: number[];
  low: number[];
  step?: number;
  max?: number;
}

export function psar(input: PSARInput): number[] {
  const { high, low, step = 0.02, max = 0.2 } = input;
  
  if (high.length !== low.length || high.length < 2) {
    return [];
  }

  const result: number[] = [];
  let currentSAR: number;
  let extremePoint: number;
  let accelerationFactor = step;
  let isUptrend: boolean;

  // Initialize
  if (high[1] > high[0]) {
    // Start with uptrend
    isUptrend = true;
    currentSAR = low[0];
    extremePoint = high[1];
  } else {
    // Start with downtrend
    isUptrend = false;
    currentSAR = high[0];
    extremePoint = low[1];
  }

  result.push(currentSAR);

  for (let i = 1; i < high.length; i++) {
    const currentHigh = high[i];
    const currentLow = low[i];
    const prevHigh = i > 0 ? high[i - 1] : currentHigh;
    const prevLow = i > 0 ? low[i - 1] : currentLow;

    // Calculate new SAR
    let newSAR = currentSAR + accelerationFactor * (extremePoint - currentSAR);

    if (isUptrend) {
      // Uptrend rules
      if (currentLow <= newSAR) {
        // Trend reversal
        isUptrend = false;
        newSAR = extremePoint;
        extremePoint = currentLow;
        accelerationFactor = step;
      } else {
        // Continue uptrend
        if (currentHigh > extremePoint) {
          extremePoint = currentHigh;
          accelerationFactor = Math.min(accelerationFactor + step, max);
        }
        
        // SAR should not be above previous low or current low
        newSAR = Math.min(newSAR, prevLow, currentLow);
      }
    } else {
      // Downtrend rules
      if (currentHigh >= newSAR) {
        // Trend reversal
        isUptrend = true;
        newSAR = extremePoint;
        extremePoint = currentHigh;
        accelerationFactor = step;
      } else {
        // Continue downtrend
        if (currentLow < extremePoint) {
          extremePoint = currentLow;
          accelerationFactor = Math.min(accelerationFactor + step, max);
        }
        
        // SAR should not be below previous high or current high
        newSAR = Math.max(newSAR, prevHigh, currentHigh);
      }
    }

    currentSAR = newSAR;
    result.push(currentSAR);
  }

  return result;
}

export class PSAR {
  private step: number;
  private max: number;
  private highValues: number[] = [];
  private lowValues: number[] = [];
  private currentSAR: number | undefined;
  private extremePoint: number | undefined;
  private accelerationFactor: number;
  private isUptrend: boolean | undefined;
  private initialized: boolean = false;

  constructor(input: PSARInput) {
    this.step = input.step || 0.02;
    this.max = input.max || 0.2;
    this.accelerationFactor = this.step;
  }

  nextValue(high: number, low: number): NumberOrUndefined {
    this.highValues.push(high);
    this.lowValues.push(low);

    if (this.highValues.length < 2) {
      return undefined;
    }

    if (!this.initialized) {
      // Initialize based on first two values
      const prevHigh = this.highValues[0];
      const prevLow = this.lowValues[0];
      
      if (high > prevHigh) {
        this.isUptrend = true;
        this.currentSAR = prevLow;
        this.extremePoint = high;
      } else {
        this.isUptrend = false;
        this.currentSAR = prevHigh;
        this.extremePoint = low;
      }
      
      this.initialized = true;
      return this.currentSAR;
    }

    // Calculate new SAR
    let newSAR = this.currentSAR! + this.accelerationFactor * (this.extremePoint! - this.currentSAR!);
    
    const prevHigh = this.highValues[this.highValues.length - 2];
    const prevLow = this.lowValues[this.lowValues.length - 2];

    if (this.isUptrend) {
      if (low <= newSAR) {
        // Trend reversal
        this.isUptrend = false;
        newSAR = this.extremePoint!;
        this.extremePoint = low;
        this.accelerationFactor = this.step;
      } else {
        // Continue uptrend
        if (high > this.extremePoint!) {
          this.extremePoint = high;
          this.accelerationFactor = Math.min(this.accelerationFactor + this.step, this.max);
        }
        newSAR = Math.min(newSAR, prevLow, low);
      }
    } else {
      if (high >= newSAR) {
        // Trend reversal
        this.isUptrend = true;
        newSAR = this.extremePoint!;
        this.extremePoint = high;
        this.accelerationFactor = this.step;
      } else {
        // Continue downtrend
        if (low < this.extremePoint!) {
          this.extremePoint = low;
          this.accelerationFactor = Math.min(this.accelerationFactor + this.step, this.max);
        }
        newSAR = Math.max(newSAR, prevHigh, high);
      }
    }

    this.currentSAR = newSAR;
    return this.currentSAR;
  }

  getResult(): number[] {
    if (this.currentSAR === undefined) {
      return [];
    }
    return [this.currentSAR];
  }

  static calculate = psar;
}