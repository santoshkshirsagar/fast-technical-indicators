import { IndicatorInput, NumberOrUndefined } from '../types';

export interface AroonInput extends IndicatorInput {
  period: number;
  high: number[];
  low: number[];
}

export interface AroonOutput {
  aroonUp?: number;
  aroonDown?: number;
  aroonOscillator?: number;
}

export function aroon(input: AroonInput): AroonOutput[] {
  const { period = 14, high, low } = input;
  
  if (high.length !== low.length || high.length < period) {
    return [];
  }

  const result: AroonOutput[] = [];
  
  for (let i = period - 1; i < high.length; i++) {
    // Get the subset of data for this period
    const highSubset = high.slice(i - period + 1, i + 1);
    const lowSubset = low.slice(i - period + 1, i + 1);
    
    // Find highest high and lowest low in the period
    let highestIdx = 0;
    let lowestIdx = 0;
    
    for (let j = 1; j < highSubset.length; j++) {
      if (highSubset[j] > highSubset[highestIdx]) {
        highestIdx = j;
      }
      if (lowSubset[j] < lowSubset[lowestIdx]) {
        lowestIdx = j;
      }
    }
    
    // Calculate periods since highest high and lowest low
    const periodsSinceHighest = period - 1 - highestIdx;
    const periodsSinceLowest = period - 1 - lowestIdx;
    
    // Calculate Aroon Up and Down (as percentages)
    const aroonUp = ((period - periodsSinceHighest) / period) * 100;
    const aroonDown = ((period - periodsSinceLowest) / period) * 100;
    const aroonOscillator = aroonUp - aroonDown;
    
    result.push({
      aroonUp,
      aroonDown,
      aroonOscillator
    });
  }
  
  return result;
}

export class Aroon {
  private period: number;
  private highValues: number[] = [];
  private lowValues: number[] = [];

  constructor(input: AroonInput) {
    this.period = input.period || 14;
  }

  nextValue(high: number, low: number): AroonOutput | undefined {
    this.highValues.push(high);
    this.lowValues.push(low);

    // Need at least period values to calculate
    if (this.highValues.length < this.period) {
      return undefined;
    }

    // Keep only the last 'period' values for efficiency
    if (this.highValues.length > this.period) {
      this.highValues.shift();
      this.lowValues.shift();
    }
    
    // Find highest high and lowest low in the period
    let highestIdx = 0;
    let lowestIdx = 0;
    
    for (let i = 1; i < this.highValues.length; i++) {
      if (this.highValues[i] > this.highValues[highestIdx]) {
        highestIdx = i;
      }
      if (this.lowValues[i] < this.lowValues[lowestIdx]) {
        lowestIdx = i;
      }
    }
    
    // Calculate periods since highest high and lowest low
    const periodsSinceHighest = this.period - 1 - highestIdx;
    const periodsSinceLowest = this.period - 1 - lowestIdx;
    
    // Calculate Aroon Up and Down (as percentages)
    const aroonUp = ((this.period - periodsSinceHighest) / this.period) * 100;
    const aroonDown = ((this.period - periodsSinceLowest) / this.period) * 100;
    const aroonOscillator = aroonUp - aroonDown;
    
    return {
      aroonUp,
      aroonDown,
      aroonOscillator
    };
  }

  getResult(): AroonOutput[] {
    if (this.highValues.length < this.period) {
      return [];
    }
    
    const lastResult = this.nextValue(
      this.highValues[this.highValues.length - 1],
      this.lowValues[this.lowValues.length - 1]
    );
    
    return lastResult ? [lastResult] : [];
  }

  static calculate = aroon;
}