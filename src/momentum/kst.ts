import { IndicatorInput, NumberOrUndefined } from '../types';
import { sma } from '../moving-averages/sma';
import { roc } from './roc';

export interface KSTInput extends IndicatorInput {
  values: number[];
  ROCPer1?: number;
  ROCPer2?: number;
  ROCPer3?: number;
  ROCPer4?: number;
  SMAROCPer1?: number;
  SMAROCPer2?: number;
  SMAROCPer3?: number;
  SMAROCPer4?: number;
  signalPeriod?: number;
}

export interface KSTOutput {
  kst?: number;
  signal?: number;
}

export function kst(input: KSTInput): KSTOutput[] {
  const {
    values,
    ROCPer1 = 10,
    ROCPer2 = 15,
    ROCPer3 = 20,
    ROCPer4 = 30,
    SMAROCPer1 = 10,
    SMAROCPer2 = 10,
    SMAROCPer3 = 10,
    SMAROCPer4 = 15,
    signalPeriod = 9
  } = input;

  if (!values || values.length === 0) {
    return [];
  }

  // Calculate ROC for each period
  const roc1 = roc({ values, period: ROCPer1 });
  const roc2 = roc({ values, period: ROCPer2 });
  const roc3 = roc({ values, period: ROCPer3 });
  const roc4 = roc({ values, period: ROCPer4 });

  // Calculate SMA of each ROC
  const smaRoc1 = sma({ values: roc1, period: SMAROCPer1 });
  const smaRoc2 = sma({ values: roc2, period: SMAROCPer2 });
  const smaRoc3 = sma({ values: roc3, period: SMAROCPer3 });
  const smaRoc4 = sma({ values: roc4, period: SMAROCPer4 });

  // Find the minimum length to align all arrays
  const minLength = Math.min(smaRoc1.length, smaRoc2.length, smaRoc3.length, smaRoc4.length);
  
  if (minLength === 0) {
    return [];
  }

  // Calculate KST values
  const kstValues: number[] = [];
  for (let i = 0; i < minLength; i++) {
    const kstValue = (smaRoc1[i] * 1) + (smaRoc2[i] * 2) + (smaRoc3[i] * 3) + (smaRoc4[i] * 4);
    kstValues.push(kstValue);
  }

  // Calculate signal line (SMA of KST)
  const signalValues = sma({ values: kstValues, period: signalPeriod });

  // Create output array
  const result: KSTOutput[] = [];
  
  // Add entries without signal first
  for (let i = 0; i < kstValues.length - signalValues.length; i++) {
    result.push({ kst: kstValues[i] });
  }

  // Add entries with both KST and signal
  for (let i = 0; i < signalValues.length; i++) {
    const kstIndex = kstValues.length - signalValues.length + i;
    result.push({
      kst: kstValues[kstIndex],
      signal: signalValues[i]
    });
  }

  return result;
}

export class KST {
  private ROCPer1: number;
  private ROCPer2: number;
  private ROCPer3: number;
  private ROCPer4: number;
  private SMAROCPer1: number;
  private SMAROCPer2: number;
  private SMAROCPer3: number;
  private SMAROCPer4: number;
  private signalPeriod: number;
  private values: number[] = [];
  private kstValues: number[] = [];

  constructor(input: KSTInput) {
    this.ROCPer1 = input.ROCPer1 || 10;
    this.ROCPer2 = input.ROCPer2 || 15;
    this.ROCPer3 = input.ROCPer3 || 20;
    this.ROCPer4 = input.ROCPer4 || 30;
    this.SMAROCPer1 = input.SMAROCPer1 || 10;
    this.SMAROCPer2 = input.SMAROCPer2 || 10;
    this.SMAROCPer3 = input.SMAROCPer3 || 10;
    this.SMAROCPer4 = input.SMAROCPer4 || 15;
    this.signalPeriod = input.signalPeriod || 9;

    if (input.values && input.values.length) {
      input.values.forEach(value => this.nextValue(value));
    }
  }

  nextValue(value: number): KSTOutput | undefined {
    this.values.push(value);

    const result = kst({
      values: this.values,
      ROCPer1: this.ROCPer1,
      ROCPer2: this.ROCPer2,
      ROCPer3: this.ROCPer3,
      ROCPer4: this.ROCPer4,
      SMAROCPer1: this.SMAROCPer1,
      SMAROCPer2: this.SMAROCPer2,
      SMAROCPer3: this.SMAROCPer3,
      SMAROCPer4: this.SMAROCPer4,
      signalPeriod: this.signalPeriod
    });

    if (result.length > 0) {
      return result[result.length - 1];
    }

    return undefined;
  }

  getResult(): KSTOutput[] {
    return kst({
      values: this.values,
      ROCPer1: this.ROCPer1,
      ROCPer2: this.ROCPer2,
      ROCPer3: this.ROCPer3,
      ROCPer4: this.ROCPer4,
      SMAROCPer1: this.SMAROCPer1,
      SMAROCPer2: this.SMAROCPer2,
      SMAROCPer3: this.SMAROCPer3,
      SMAROCPer4: this.SMAROCPer4,
      signalPeriod: this.signalPeriod
    });
  }

  static calculate = kst;
}