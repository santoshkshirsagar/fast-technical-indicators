import { IndicatorInput, NumberOrUndefined } from '../types';

// Highest value in a period
export function highest(input: { period: number; values: number[] }): number[] {
  const { period, values } = input;
  if (period <= 0 || values.length < period) {
    return [];
  }

  const result: number[] = [];
  for (let i = period - 1; i < values.length; i++) {
    let max = values[i - period + 1];
    for (let j = i - period + 2; j <= i; j++) {
      if (values[j] > max) {
        max = values[j];
      }
    }
    result.push(max);
  }
  return result;
}

// Lowest value in a period
export function lowest(input: { period: number; values: number[] }): number[] {
  const { period, values } = input;
  if (period <= 0 || values.length < period) {
    return [];
  }

  const result: number[] = [];
  for (let i = period - 1; i < values.length; i++) {
    let min = values[i - period + 1];
    for (let j = i - period + 2; j <= i; j++) {
      if (values[j] < min) {
        min = values[j];
      }
    }
    result.push(min);
  }
  return result;
}

// Standard Deviation
export function sd(input: { period: number; values: number[] }): number[] {
  const { period, values } = input;
  if (period <= 0 || values.length < period) {
    return [];
  }

  const result: number[] = [];
  for (let i = period - 1; i < values.length; i++) {
    const periodValues = values.slice(i - period + 1, i + 1);
    const mean = periodValues.reduce((sum, val) => sum + val, 0) / period;
    const squaredDifferences = periodValues.map(val => Math.pow(val - mean, 2));
    const variance = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / period;
    result.push(Math.sqrt(variance));
  }
  return result;
}

// Sum over a period
export function sum(input: { period: number; values: number[] }): number[] {
  const { period, values } = input;
  if (period <= 0 || values.length < period) {
    return [];
  }

  const result: number[] = [];
  for (let i = period - 1; i < values.length; i++) {
    let total = 0;
    for (let j = i - period + 1; j <= i; j++) {
      total += values[j];
    }
    result.push(total);
  }
  return result;
}

// Average Gain calculation
export function averageGain(input: { period: number; values: number[] }): number[] {
  const { period, values } = input;
  if (values.length <= period) {
    return [];
  }

  const gains: number[] = [];
  for (let i = 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    gains.push(diff > 0 ? diff : 0);
  }

  const result: number[] = [];
  for (let i = period - 1; i < gains.length; i++) {
    const periodGains = gains.slice(i - period + 1, i + 1);
    const avgGain = periodGains.reduce((sum, gain) => sum + gain, 0) / period;
    result.push(avgGain);
  }
  
  return result;
}

// Average Loss calculation
export function averageLoss(input: { period: number; values: number[] }): number[] {
  const { period, values } = input;
  if (values.length <= period) {
    return [];
  }

  const losses: number[] = [];
  for (let i = 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    losses.push(diff < 0 ? Math.abs(diff) : 0);
  }

  const result: number[] = [];
  for (let i = period - 1; i < losses.length; i++) {
    const periodLosses = losses.slice(i - period + 1, i + 1);
    const avgLoss = periodLosses.reduce((sum, loss) => sum + loss, 0) / period;
    result.push(avgLoss);
  }
  
  return result;
}

// Cross Up detection
export function crossUp(input: { lineA: number[]; lineB: number[] }): boolean[] {
  const { lineA, lineB } = input;
  const result: boolean[] = [];
  
  if (lineA.length !== lineB.length || lineA.length < 2) {
    return result;
  }

  result.push(false); // First value is always false
  
  for (let i = 1; i < lineA.length; i++) {
    const crossedUp = lineA[i - 1] <= lineB[i - 1] && lineA[i] > lineB[i];
    result.push(crossedUp);
  }
  
  return result;
}

// Cross Down detection
export function crossDown(input: { lineA: number[]; lineB: number[] }): boolean[] {
  const { lineA, lineB } = input;
  const result: boolean[] = [];
  
  if (lineA.length !== lineB.length || lineA.length < 2) {
    return result;
  }

  result.push(false); // First value is always false
  
  for (let i = 1; i < lineA.length; i++) {
    const crossedDown = lineA[i - 1] >= lineB[i - 1] && lineA[i] < lineB[i];
    result.push(crossedDown);
  }
  
  return result;
}

// Classes for streaming calculations
export class Highest {
  private period: number;
  private values: number[] = [];

  constructor(input: { period: number; values?: number[] }) {
    this.period = input.period;
    if (input.values?.length) {
      input.values.forEach(value => this.nextValue(value));
    }
  }

  nextValue(value: number): NumberOrUndefined {
    this.values.push(value);
    
    if (this.values.length > this.period) {
      this.values.shift();
    }

    if (this.values.length === this.period) {
      return Math.max(...this.values);
    }
    
    return undefined;
  }

  static calculate = highest;
}

export class Lowest {
  private period: number;
  private values: number[] = [];

  constructor(input: { period: number; values?: number[] }) {
    this.period = input.period;
    if (input.values?.length) {
      input.values.forEach(value => this.nextValue(value));
    }
  }

  nextValue(value: number): NumberOrUndefined {
    this.values.push(value);
    
    if (this.values.length > this.period) {
      this.values.shift();
    }

    if (this.values.length === this.period) {
      return Math.min(...this.values);
    }
    
    return undefined;
  }

  static calculate = lowest;
}