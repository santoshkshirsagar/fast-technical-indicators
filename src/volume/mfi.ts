import { IndicatorInput, NumberOrUndefined } from '../types';

export interface MFIInput extends IndicatorInput {
  period: number;
  high: number[];
  low: number[];
  close: number[];
  volume: number[];
}

export function mfi(input: MFIInput): number[] {
  const { period = 14, high, low, close, volume } = input;
  
  if (high.length !== low.length || low.length !== close.length || 
      close.length !== volume.length || close.length < period + 1) {
    return [];
  }

  const result: number[] = [];
  
  // Calculate typical prices and raw money flow
  const typicalPrices: number[] = [];
  const rawMoneyFlow: number[] = [];
  
  for (let i = 0; i < close.length; i++) {
    const typicalPrice = (high[i] + low[i] + close[i]) / 3;
    typicalPrices.push(typicalPrice);
    rawMoneyFlow.push(typicalPrice * volume[i]);
  }
  
  for (let i = period; i < close.length; i++) {
    let positiveMoneyFlow = 0;
    let negativeMoneyFlow = 0;
    
    for (let j = i - period + 1; j <= i; j++) {
      if (typicalPrices[j] > typicalPrices[j - 1]) {
        positiveMoneyFlow += rawMoneyFlow[j];
      } else if (typicalPrices[j] < typicalPrices[j - 1]) {
        negativeMoneyFlow += rawMoneyFlow[j];
      }
      // If equal, no flow is added to either
    }
    
    if (negativeMoneyFlow === 0) {
      result.push(100);
    } else {
      const moneyFlowRatio = positiveMoneyFlow / negativeMoneyFlow;
      const mfiValue = 100 - (100 / (1 + moneyFlowRatio));
      result.push(mfiValue);
    }
  }
  
  return result;
}

export class MFI {
  private period: number;
  private highValues: number[] = [];
  private lowValues: number[] = [];
  private closeValues: number[] = [];
  private volumeValues: number[] = [];
  private typicalPrices: number[] = [];
  private rawMoneyFlow: number[] = [];

  constructor(input: MFIInput) {
    this.period = input.period || 14;
  }

  nextValue(high: number, low: number, close: number, volume: number): NumberOrUndefined {
    this.highValues.push(high);
    this.lowValues.push(low);
    this.closeValues.push(close);
    this.volumeValues.push(volume);

    const typicalPrice = (high + low + close) / 3;
    this.typicalPrices.push(typicalPrice);
    this.rawMoneyFlow.push(typicalPrice * volume);

    // Keep only required data
    if (this.typicalPrices.length > this.period + 1) {
      this.highValues.shift();
      this.lowValues.shift();
      this.closeValues.shift();
      this.volumeValues.shift();
      this.typicalPrices.shift();
      this.rawMoneyFlow.shift();
    }

    if (this.typicalPrices.length < this.period + 1) {
      return undefined;
    }

    let positiveMoneyFlow = 0;
    let negativeMoneyFlow = 0;
    
    for (let i = 1; i < this.typicalPrices.length; i++) {
      if (this.typicalPrices[i] > this.typicalPrices[i - 1]) {
        positiveMoneyFlow += this.rawMoneyFlow[i];
      } else if (this.typicalPrices[i] < this.typicalPrices[i - 1]) {
        negativeMoneyFlow += this.rawMoneyFlow[i];
      }
    }

    if (negativeMoneyFlow === 0) {
      return 100;
    }

    const moneyFlowRatio = positiveMoneyFlow / negativeMoneyFlow;
    return 100 - (100 / (1 + moneyFlowRatio));
  }

  getResult(): number[] {
    if (this.typicalPrices.length < this.period + 1) {
      return [];
    }

    let positiveMoneyFlow = 0;
    let negativeMoneyFlow = 0;
    
    for (let i = 1; i < this.typicalPrices.length; i++) {
      if (this.typicalPrices[i] > this.typicalPrices[i - 1]) {
        positiveMoneyFlow += this.rawMoneyFlow[i];
      } else if (this.typicalPrices[i] < this.typicalPrices[i - 1]) {
        negativeMoneyFlow += this.rawMoneyFlow[i];
      }
    }

    if (negativeMoneyFlow === 0) {
      return [100];
    }

    const moneyFlowRatio = positiveMoneyFlow / negativeMoneyFlow;
    return [100 - (100 / (1 + moneyFlowRatio))];
  }

  static calculate = mfi;
}