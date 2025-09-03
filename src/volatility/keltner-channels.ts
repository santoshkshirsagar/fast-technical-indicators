import { IndicatorInput } from '../types';
import { ema } from '../moving-averages/ema';
import { atr } from './atr';

export interface KeltnerChannelsInput extends IndicatorInput {
  high: number[];
  low: number[];
  close: number[];
  period?: number;
  multiplier?: number;
}

export interface KeltnerChannelsOutput {
  middle?: number;
  upper?: number;
  lower?: number;
}

export function keltnerchannel(input: KeltnerChannelsInput): KeltnerChannelsOutput[] {
  const { high, low, close, period = 20, multiplier = 2 } = input;

  if (!high || !low || !close || 
      high.length !== low.length || 
      low.length !== close.length || 
      high.length === 0) {
    return [];
  }

  // Calculate EMA of close prices (middle line)
  const middleValues = ema({ period, values: close });
  
  // Calculate ATR
  const atrValues = atr({ high, low, close, period });

  const result: KeltnerChannelsOutput[] = [];
  
  // Align arrays - ATR and EMA might have different starting points
  
  for (let i = 0; i < Math.min(middleValues.length, atrValues.length); i++) {
    const middle = middleValues[i];
    const atrValue = atrValues[i];
    
    result.push({
      middle,
      upper: middle + (multiplier * atrValue),
      lower: middle - (multiplier * atrValue)
    });
  }

  return result;
}

export class KeltnerChannels {
  private period: number;
  private multiplier: number;
  private highValues: number[] = [];
  private lowValues: number[] = [];
  private closeValues: number[] = [];

  constructor(input: KeltnerChannelsInput) {
    this.period = input.period || 20;
    this.multiplier = input.multiplier || 2;

    if (input.high && input.low && input.close &&
        input.high.length === input.low.length &&
        input.low.length === input.close.length) {
      for (let i = 0; i < input.high.length; i++) {
        this.nextValue(input.high[i], input.low[i], input.close[i]);
      }
    }
  }

  nextValue(high: number, low: number, close: number): KeltnerChannelsOutput | undefined {
    this.highValues.push(high);
    this.lowValues.push(low);
    this.closeValues.push(close);

    const result = keltnerchannel({
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

  getResult(): KeltnerChannelsOutput[] {
    return keltnerchannel({
      high: this.highValues,
      low: this.lowValues,
      close: this.closeValues,
      period: this.period,
      multiplier: this.multiplier
    });
  }

  static calculate = keltnerchannel;
}