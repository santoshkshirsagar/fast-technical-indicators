import { MACDInput, MACDOutput, NumberOrUndefined } from '../types';
import { ema, EMA } from './ema';
import { sma, SMA } from './sma';

export function macd(input: MACDInput): MACDOutput[] {
  const {
    values = [],
    fastPeriod = 12,
    slowPeriod = 26,
    signalPeriod = 9,
    SimpleMAOscillator = false,
    SimpleMASignal = false
  } = input;

  if (values.length < slowPeriod) {
    return [];
  }

  const result: MACDOutput[] = [];
  
  // Calculate fast and slow moving averages
  const fastMA = SimpleMAOscillator 
    ? sma({ period: fastPeriod, values })
    : ema({ period: fastPeriod, values });
    
  const slowMA = SimpleMAOscillator
    ? sma({ period: slowPeriod, values })
    : ema({ period: slowPeriod, values });

  // Calculate MACD line
  const macdLine: number[] = [];
  const startIndex = slowPeriod - fastPeriod;
  
  for (let i = 0; i < slowMA.length; i++) {
    macdLine.push(fastMA[i + startIndex] - slowMA[i]);
  }

  // Calculate signal line
  const signalLine = SimpleMASignal
    ? sma({ period: signalPeriod, values: macdLine })
    : ema({ period: signalPeriod, values: macdLine });

  // Create result array
  for (let i = 0; i < macdLine.length; i++) {
    const macdValue = macdLine[i];
    const signalValue = i >= signalPeriod - 1 ? signalLine[i - signalPeriod + 1] : undefined;
    const histogramValue = signalValue !== undefined ? macdValue - signalValue : undefined;

    result.push({
      MACD: macdValue,
      signal: signalValue,
      histogram: histogramValue
    });
  }

  return result;
}

export class MACD {
  private fastPeriod: number;
  private slowPeriod: number;
  private signalPeriod: number;
  private fastEMA: EMA | SMA;
  private slowEMA: EMA | SMA;
  private signalEMA: EMA | SMA;
  private macdHistory: number[] = [];
  private initialized: boolean = false;
  private count: number = 0;

  constructor(input: MACDInput) {
    this.fastPeriod = input.fastPeriod || 12;
    this.slowPeriod = input.slowPeriod || 26;
    this.signalPeriod = input.signalPeriod || 9;

    const EMACls = input.SimpleMAOscillator ? SMA : EMA;
    const SignalCls = input.SimpleMASignal ? SMA : EMA;

    this.fastEMA = new EMACls({ period: this.fastPeriod, values: [] });
    this.slowEMA = new EMACls({ period: this.slowPeriod, values: [] });
    this.signalEMA = new SignalCls({ period: this.signalPeriod, values: [] });

    if (input.values?.length) {
      input.values.forEach(value => this.nextValue(value));
    }
  }

  nextValue(value: number): MACDOutput | undefined {
    this.count++;
    
    const fastValue = this.fastEMA.nextValue(value);
    const slowValue = this.slowEMA.nextValue(value);

    if (fastValue === undefined || slowValue === undefined) {
      return undefined;
    }

    const macdValue = fastValue - slowValue;
    this.macdHistory.push(macdValue);
    
    const signalValue = this.signalEMA.nextValue(macdValue);
    const histogramValue = signalValue !== undefined ? macdValue - signalValue : undefined;

    return {
      MACD: macdValue,
      signal: signalValue,
      histogram: histogramValue
    };
  }

  getResult(): MACDOutput[] {
    if (this.macdHistory.length === 0) {
      return [];
    }

    const lastMACD = this.macdHistory[this.macdHistory.length - 1];
    const signalResult = this.signalEMA.getResult();
    const lastSignal = signalResult.length > 0 ? signalResult[0] : undefined;
    const histogram = lastSignal !== undefined ? lastMACD - lastSignal : undefined;

    return [{
      MACD: lastMACD,
      signal: lastSignal,
      histogram: histogram
    }];
  }

  static calculate = macd;
}