import { IndicatorInput, NumberOrUndefined } from '../types';
import { highest, lowest } from '../utils/index';
import { atr } from './atr';

export interface ChandelierExitInput extends IndicatorInput {
  high: number[];
  low: number[];
  close: number[];
  period?: number;
  multiplier?: number;
}

export interface ChandelierExitOutput {
  exitLong?: number;
  exitShort?: number;
}

export function chandelierexit(input: ChandelierExitInput): ChandelierExitOutput[] {
  const { high, low, close, period = 22, multiplier = 3 } = input;

  if (!high || !low || !close || 
      high.length !== low.length || 
      low.length !== close.length || 
      high.length === 0) {
    return [];
  }

  // Calculate ATR
  const atrValues = atr({ high, low, close, period });

  const result: ChandelierExitOutput[] = [];

  // We need enough data for both highest/lowest and ATR calculations
  const startIndex = period - 1;

  for (let i = startIndex; i < high.length; i++) {
    const output: ChandelierExitOutput = {};

    // Get the corresponding ATR value
    const atrIndex = i - startIndex;
    if (atrIndex < atrValues.length) {
      const currentATR = atrValues[atrIndex];

      // Calculate highest high over the period
      const highestHigh = highest({
        values: high.slice(i - period + 1, i + 1),
        period
      })[0];

      // Calculate lowest low over the period  
      const lowestLow = lowest({
        values: low.slice(i - period + 1, i + 1),
        period
      })[0];

      // Chandelier Exit Long (sell signal for long positions)
      output.exitLong = highestHigh - (multiplier * currentATR);

      // Chandelier Exit Short (buy signal for short positions)
      output.exitShort = lowestLow + (multiplier * currentATR);
    }

    result.push(output);
  }

  return result;
}

export class ChandelierExit {
  private period: number;
  private multiplier: number;
  private highValues: number[] = [];
  private lowValues: number[] = [];
  private closeValues: number[] = [];

  constructor(input: ChandelierExitInput) {
    this.period = input.period || 22;
    this.multiplier = input.multiplier || 3;

    if (input.high && input.low && input.close &&
        input.high.length === input.low.length &&
        input.low.length === input.close.length) {
      for (let i = 0; i < input.high.length; i++) {
        this.nextValue(input.high[i], input.low[i], input.close[i]);
      }
    }
  }

  nextValue(high: number, low: number, close: number): ChandelierExitOutput | undefined {
    this.highValues.push(high);
    this.lowValues.push(low);
    this.closeValues.push(close);

    const result = chandelierexit({
      high: this.highValues,
      low: this.lowValues,
      close: this.closeValues,
      period: this.period,
      multiplier: this.multiplier
    });

    if (result.length > 0) {
      return result[result.length - 1];
    }

    return undefined;
  }

  getResult(): ChandelierExitOutput[] {
    return chandelierexit({
      high: this.highValues,
      low: this.lowValues,
      close: this.closeValues,
      period: this.period,
      multiplier: this.multiplier
    });
  }

  static calculate = chandelierexit;
}