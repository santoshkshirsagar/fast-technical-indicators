import { IndicatorInput, NumberOrUndefined } from '../types';
import { highest, lowest } from '../utils/index';

export interface IchimokuInput extends IndicatorInput {
  high: number[];
  low: number[];
  conversionPeriod?: number;
  basePeriod?: number;
  spanPeriod?: number;
  displacement?: number;
}

export interface IchimokuOutput {
  conversion?: number;
  base?: number;
  spanA?: number;
  spanB?: number;
  lagging?: number;
}

export function ichimokukinkouhyou(input: IchimokuInput): IchimokuOutput[] {
  const {
    high,
    low,
    conversionPeriod = 9,
    basePeriod = 26,
    spanPeriod = 52,
    displacement = 26
  } = input;

  if (!high || !low || high.length !== low.length || high.length === 0) {
    return [];
  }

  const result: IchimokuOutput[] = [];
  const maxPeriod = Math.max(conversionPeriod, basePeriod, spanPeriod);

  for (let i = 0; i < high.length; i++) {
    const output: IchimokuOutput = {};

    // Conversion Line (Tenkan-sen)
    if (i >= conversionPeriod - 1) {
      const conversionHigh = highest({ 
        values: high.slice(i - conversionPeriod + 1, i + 1), 
        period: conversionPeriod 
      })[0];
      const conversionLow = lowest({ 
        values: low.slice(i - conversionPeriod + 1, i + 1), 
        period: conversionPeriod 
      })[0];
      output.conversion = (conversionHigh + conversionLow) / 2;
    }

    // Base Line (Kijun-sen)
    if (i >= basePeriod - 1) {
      const baseHigh = highest({ 
        values: high.slice(i - basePeriod + 1, i + 1), 
        period: basePeriod 
      })[0];
      const baseLow = lowest({ 
        values: low.slice(i - basePeriod + 1, i + 1), 
        period: basePeriod 
      })[0];
      output.base = (baseHigh + baseLow) / 2;
    }

    // Leading Span A (Senkou Span A) - projected displacement periods ahead
    if (output.conversion !== undefined && output.base !== undefined) {
      output.spanA = (output.conversion + output.base) / 2;
    }

    // Leading Span B (Senkou Span B) - projected displacement periods ahead  
    if (i >= spanPeriod - 1) {
      const spanHigh = highest({ 
        values: high.slice(i - spanPeriod + 1, i + 1), 
        period: spanPeriod 
      })[0];
      const spanLow = lowest({ 
        values: low.slice(i - spanPeriod + 1, i + 1), 
        period: spanPeriod 
      })[0];
      output.spanB = (spanHigh + spanLow) / 2;
    }

    // Lagging Span (Chikou Span) - current close displaced back
    // Note: This would typically use close prices, but we only have high/low
    // Using midpoint of high/low as approximation
    const midPrice = (high[i] + low[i]) / 2;
    output.lagging = midPrice;

    result.push(output);
  }

  return result;
}

export class IchimokuKinkouhyou {
  private conversionPeriod: number;
  private basePeriod: number;
  private spanPeriod: number;
  private displacement: number;
  private highValues: number[] = [];
  private lowValues: number[] = [];

  constructor(input: IchimokuInput) {
    this.conversionPeriod = input.conversionPeriod || 9;
    this.basePeriod = input.basePeriod || 26;
    this.spanPeriod = input.spanPeriod || 52;
    this.displacement = input.displacement || 26;

    if (input.high && input.low && input.high.length === input.low.length) {
      for (let i = 0; i < input.high.length; i++) {
        this.nextValue(input.high[i], input.low[i]);
      }
    }
  }

  nextValue(high: number, low: number): IchimokuOutput | undefined {
    this.highValues.push(high);
    this.lowValues.push(low);

    const result = ichimokukinkouhyou({
      high: this.highValues,
      low: this.lowValues,
      conversionPeriod: this.conversionPeriod,
      basePeriod: this.basePeriod,
      spanPeriod: this.spanPeriod,
      displacement: this.displacement
    });

    if (result.length > 0) {
      return result[result.length - 1];
    }

    return undefined;
  }

  getResult(): IchimokuOutput[] {
    return ichimokukinkouhyou({
      high: this.highValues,
      low: this.lowValues,
      conversionPeriod: this.conversionPeriod,
      basePeriod: this.basePeriod,
      spanPeriod: this.spanPeriod,
      displacement: this.displacement
    });
  }

  static calculate = ichimokukinkouhyou;
}