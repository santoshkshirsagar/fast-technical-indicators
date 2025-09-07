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
  const period = Math.max(conversionPeriod, basePeriod, spanPeriod, displacement);

  // Only start producing results after the maximum period is reached
  for (let i = period - 1; i < high.length; i++) {
    // Conversion Line (Tenkan-sen): (conversionPeriod-high + conversionPeriod-low)/2
    const conversionHigh = highest({ 
      values: high.slice(i - conversionPeriod + 1, i + 1), 
      period: conversionPeriod 
    })[0];
    const conversionLow = lowest({ 
      values: low.slice(i - conversionPeriod + 1, i + 1), 
      period: conversionPeriod 
    })[0];
    const conversion = (conversionHigh + conversionLow) / 2;

    // Base Line (Kijun-sen): (basePeriod-high + basePeriod-low)/2
    const baseHigh = highest({ 
      values: high.slice(i - basePeriod + 1, i + 1), 
      period: basePeriod 
    })[0];
    const baseLow = lowest({ 
      values: low.slice(i - basePeriod + 1, i + 1), 
      period: basePeriod 
    })[0];
    const base = (baseHigh + baseLow) / 2;

    // Leading Span A (Senkou Span A): (Conversion Line + Base Line)/2
    const spanA = (conversion + base) / 2;

    // Leading Span B (Senkou Span B): (spanPeriod-high + spanPeriod-low)/2
    const spanBHigh = highest({ 
      values: high.slice(i - spanPeriod + 1, i + 1), 
      period: spanPeriod 
    })[0];
    const spanBLow = lowest({ 
      values: low.slice(i - spanPeriod + 1, i + 1), 
      period: spanPeriod 
    })[0];
    const spanB = (spanBHigh + spanBLow) / 2;

    const output: IchimokuOutput = {
      conversion,
      base,
      spanA,
      spanB
    };

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
  private result: IchimokuOutput[] = [];
  private period: number;

  constructor(input: IchimokuInput) {
    this.conversionPeriod = input.conversionPeriod || 9;
    this.basePeriod = input.basePeriod || 26;
    this.spanPeriod = input.spanPeriod || 52;
    this.displacement = input.displacement || 26;
    this.period = Math.max(this.conversionPeriod, this.basePeriod, this.spanPeriod, this.displacement);

    if (input.high && input.low && input.high.length === input.low.length) {
      this.highValues = [...input.high];
      this.lowValues = [...input.low];
      this.result = ichimokukinkouhyou({
        high: this.highValues,
        low: this.lowValues,
        conversionPeriod: this.conversionPeriod,
        basePeriod: this.basePeriod,
        spanPeriod: this.spanPeriod,
        displacement: this.displacement
      });
    }
  }

  nextValue(high: number, low: number): IchimokuOutput | undefined {
    this.highValues.push(high);
    this.lowValues.push(low);

    // Only return a value once we have enough data
    if (this.highValues.length >= this.period) {
      const currentIndex = this.highValues.length - 1;
      const i = currentIndex;

      // Calculate the same way as the functional version
      const conversionHigh = highest({ 
        values: this.highValues.slice(i - this.conversionPeriod + 1, i + 1), 
        period: this.conversionPeriod 
      })[0];
      const conversionLow = lowest({ 
        values: this.lowValues.slice(i - this.conversionPeriod + 1, i + 1), 
        period: this.conversionPeriod 
      })[0];
      const conversion = (conversionHigh + conversionLow) / 2;

      const baseHigh = highest({ 
        values: this.highValues.slice(i - this.basePeriod + 1, i + 1), 
        period: this.basePeriod 
      })[0];
      const baseLow = lowest({ 
        values: this.lowValues.slice(i - this.basePeriod + 1, i + 1), 
        period: this.basePeriod 
      })[0];
      const base = (baseHigh + baseLow) / 2;

      const spanA = (conversion + base) / 2;

      const spanBHigh = highest({ 
        values: this.highValues.slice(i - this.spanPeriod + 1, i + 1), 
        period: this.spanPeriod 
      })[0];
      const spanBLow = lowest({ 
        values: this.lowValues.slice(i - this.spanPeriod + 1, i + 1), 
        period: this.spanPeriod 
      })[0];
      const spanB = (spanBHigh + spanBLow) / 2;

      const output: IchimokuOutput = {
        conversion,
        base,
        spanA,
        spanB
      };

      this.result.push(output);
      return output;
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

// Alias for compatibility with technicalindicators package
export const IchimokuCloud = IchimokuKinkouhyou;
export const ichimokucloud = ichimokukinkouhyou;