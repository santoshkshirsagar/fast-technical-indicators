import { IndicatorInput, NumberOrUndefined } from '../types';

// AverageGain class - missing from our implementation
export class AverageGain {
  private period: number;
  private values: number[] = [];
  private gains: number[] = [];
  private avgGain: number = 0;
  private initialized: boolean = false;

  constructor(input: { period: number; values?: number[] }) {
    this.period = input.period;
    if (input.values?.length) {
      input.values.forEach(value => this.nextValue(value));
    }
  }

  nextValue(value: number): NumberOrUndefined {
    this.values.push(value);

    if (this.values.length < 2) {
      return undefined;
    }

    const diff = value - this.values[this.values.length - 2];
    const gain = diff > 0 ? diff : 0;
    this.gains.push(gain);

    if (!this.initialized) {
      if (this.gains.length === this.period) {
        this.avgGain = this.gains.reduce((sum, g) => sum + g, 0) / this.period;
        this.initialized = true;
        return this.avgGain;
      }
      return undefined;
    }

    // Wilder's smoothing
    this.avgGain = ((this.avgGain * (this.period - 1)) + gain) / this.period;
    return this.avgGain;
  }

  getResult(): number[] {
    if (!this.initialized) {
      return [];
    }
    return [this.avgGain];
  }

  static calculate = averagegain;
}

// AverageLoss class - missing from our implementation
export class AverageLoss {
  private period: number;
  private values: number[] = [];
  private losses: number[] = [];
  private avgLoss: number = 0;
  private initialized: boolean = false;

  constructor(input: { period: number; values?: number[] }) {
    this.period = input.period;
    if (input.values?.length) {
      input.values.forEach(value => this.nextValue(value));
    }
  }

  nextValue(value: number): NumberOrUndefined {
    this.values.push(value);

    if (this.values.length < 2) {
      return undefined;
    }

    const diff = value - this.values[this.values.length - 2];
    const loss = diff < 0 ? Math.abs(diff) : 0;
    this.losses.push(loss);

    if (!this.initialized) {
      if (this.losses.length === this.period) {
        this.avgLoss = this.losses.reduce((sum, l) => sum + l, 0) / this.period;
        this.initialized = true;
        return this.avgLoss;
      }
      return undefined;
    }

    // Wilder's smoothing
    this.avgLoss = ((this.avgLoss * (this.period - 1)) + loss) / this.period;
    return this.avgLoss;
  }

  getResult(): number[] {
    if (!this.initialized) {
      return [];
    }
    return [this.avgLoss];
  }

  static calculate = averageloss;
}

// SD class - missing from our implementation 
export class SD {
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
      const mean = this.values.reduce((sum, val) => sum + val, 0) / this.period;
      const squaredDifferences = this.values.map(val => Math.pow(val - mean, 2));
      const variance = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / this.period;
      return Math.sqrt(variance);
    }

    return undefined;
  }

  getResult(): number[] {
    if (this.values.length < this.period) {
      return [];
    }

    const mean = this.values.reduce((sum, val) => sum + val, 0) / this.period;
    const squaredDifferences = this.values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / this.period;
    return [Math.sqrt(variance)];
  }

  static calculate = sd;
}

// Re-export the functional versions
import { averageGain as averagegain, averageLoss as averageloss, sd } from './index';