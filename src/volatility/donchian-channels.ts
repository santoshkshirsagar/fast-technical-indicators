import { IndicatorInput, NumberOrUndefined } from '../types';

export interface DonchianChannelsInput extends IndicatorInput {
  period: number;
  high: number[];
  low: number[];
}

export interface DonchianChannelsOutput {
  upper?: number;
  middle?: number;
  lower?: number;
  width?: number;
}

export function donchianchannels(input: DonchianChannelsInput): DonchianChannelsOutput[] {
  const { period = 20, high, low } = input;
  
  if (high.length !== low.length || high.length < period) {
    return [];
  }

  const result: DonchianChannelsOutput[] = [];
  
  for (let i = period - 1; i < high.length; i++) {
    // Get the subset of data for this period
    const highSubset = high.slice(i - period + 1, i + 1);
    const lowSubset = low.slice(i - period + 1, i + 1);
    
    // Find highest high and lowest low in the period
    const upperChannel = Math.max(...highSubset);
    const lowerChannel = Math.min(...lowSubset);
    const middleChannel = (upperChannel + lowerChannel) / 2;
    const channelWidth = upperChannel - lowerChannel;
    
    result.push({
      upper: upperChannel,
      middle: middleChannel,
      lower: lowerChannel,
      width: channelWidth
    });
  }
  
  return result;
}

export class DonchianChannels {
  private period: number;
  private highValues: number[] = [];
  private lowValues: number[] = [];

  constructor(input: DonchianChannelsInput) {
    this.period = input.period || 20;
  }

  nextValue(high: number, low: number): DonchianChannelsOutput | undefined {
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
    const upperChannel = Math.max(...this.highValues);
    const lowerChannel = Math.min(...this.lowValues);
    const middleChannel = (upperChannel + lowerChannel) / 2;
    const channelWidth = upperChannel - lowerChannel;
    
    return {
      upper: upperChannel,
      middle: middleChannel,
      lower: lowerChannel,
      width: channelWidth
    };
  }

  getResult(): DonchianChannelsOutput[] {
    if (this.highValues.length < this.period) {
      return [];
    }
    
    const lastResult = this.nextValue(
      this.highValues[this.highValues.length - 1],
      this.lowValues[this.lowValues.length - 1]
    );
    
    return lastResult ? [lastResult] : [];
  }

  static calculate = donchianchannels;
}