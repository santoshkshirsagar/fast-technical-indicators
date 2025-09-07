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
      close.length !== volume.length) {
    return [];
  }

  const result: number[] = [];
  
  // Arrays to track positive and negative money flow for rolling window
  const positiveFlows: number[] = [];
  const negativeFlows: number[] = [];
  
  let prevTypicalPrice: number | null = null;
  let calculationStarted = false;
  
  for (let i = 0; i < high.length; i++) {
    const typicalPrice = (high[i] + low[i] + close[i]) / 3;
    const rawMoneyFlow = typicalPrice * volume[i];
    
    if (i === 0) {
      prevTypicalPrice = typicalPrice;
      continue;
    }
    
    let positiveMoney = 0;
    let negativeMoney = 0;
    
    if (prevTypicalPrice !== null && typicalPrice !== null) {
      if (typicalPrice > prevTypicalPrice) {
        positiveMoney = rawMoneyFlow;
      } else if (typicalPrice < prevTypicalPrice) {
        negativeMoney = rawMoneyFlow;
      }
      // If equal, both remain 0
    }
    
    positiveFlows.push(positiveMoney);
    negativeFlows.push(negativeMoney);
    
    // Keep only the required period window
    if (positiveFlows.length > period) {
      positiveFlows.shift();
      negativeFlows.shift();
    }
    
    // Calculate MFI when we have enough data, but skip the first calculation
    if (positiveFlows.length === period) {
      if (!calculationStarted) {
        calculationStarted = true;
      } else {
        const positiveFlowSum = positiveFlows.reduce((sum, flow) => sum + flow, 0);
        const negativeFlowSum = negativeFlows.reduce((sum, flow) => sum + flow, 0);
        
        let mfiValue: number;
        if (negativeFlowSum === 0) {
          mfiValue = 100;
        } else {
          const moneyFlowRatio = positiveFlowSum / negativeFlowSum;
          mfiValue = 100 - (100 / (1 + moneyFlowRatio));
        }
        
        // Round to 2 decimal places like the reference implementation
        result.push(parseFloat(mfiValue.toFixed(2)));
      }
    }
    
    prevTypicalPrice = typicalPrice;
  }
  
  return result;
}

export class MFI {
  private period: number;
  private positiveFlows: number[] = [];
  private negativeFlows: number[] = [];
  private prevTypicalPrice: number | null = null;
  private results: number[] = [];
  private skipFirst: boolean = true;
  private firstMFICalculated: boolean = false;

  constructor(input: MFIInput) {
    this.period = input.period || 14;
  }

  nextValue(high: number, low: number, close: number, volume: number): NumberOrUndefined {
    const typicalPrice = (high + low + close) / 3;
    const rawMoneyFlow = typicalPrice * volume;
    
    if (this.skipFirst) {
      this.prevTypicalPrice = typicalPrice;
      this.skipFirst = false;
      return undefined;
    }
    
    let positiveMoney = 0;
    let negativeMoney = 0;
    
    if (this.prevTypicalPrice !== null && typicalPrice !== null) {
      if (typicalPrice > this.prevTypicalPrice) {
        positiveMoney = rawMoneyFlow;
      } else if (typicalPrice < this.prevTypicalPrice) {
        negativeMoney = rawMoneyFlow;
      }
    }
    
    this.positiveFlows.push(positiveMoney);
    this.negativeFlows.push(negativeMoney);
    
    // Keep only the required period window
    if (this.positiveFlows.length > this.period) {
      this.positiveFlows.shift();
      this.negativeFlows.shift();
    }
    
    // Calculate MFI when we have enough data
    if (this.positiveFlows.length >= this.period) {
      // Skip the first MFI calculation to match reference implementation
      if (!this.firstMFICalculated) {
        this.firstMFICalculated = true;
      } else {
        const positiveFlowSum = this.positiveFlows.reduce((sum, flow) => sum + flow, 0);
        const negativeFlowSum = this.negativeFlows.reduce((sum, flow) => sum + flow, 0);
        
        let mfiValue: number;
        if (negativeFlowSum === 0) {
          mfiValue = 100;
        } else {
          const moneyFlowRatio = positiveFlowSum / negativeFlowSum;
          mfiValue = 100 - (100 / (1 + moneyFlowRatio));
        }
        
        // Round to 2 decimal places like the reference implementation
        const result = parseFloat(mfiValue.toFixed(2));
        this.results.push(result);
        this.prevTypicalPrice = typicalPrice;
        return result;
      }
    }
    
    this.prevTypicalPrice = typicalPrice;
    return undefined;
  }

  getResult(): number[] {
    return this.results;
  }

  static calculate = mfi;
}