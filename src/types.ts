export interface CandleData {
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface IndicatorInput {
  values?: number[];
  period?: number;
  reversedInput?: boolean;
}

export interface MACDInput extends IndicatorInput {
  fastPeriod?: number;
  slowPeriod?: number;
  signalPeriod?: number;
  SimpleMAOscillator?: boolean;
  SimpleMASignal?: boolean;
}

export interface MACDOutput {
  MACD?: number;
  signal?: number;
  histogram?: number;
}

export interface BollingerBandsInput extends IndicatorInput {
  stdDev?: number;
}

export interface BollingerBandsOutput {
  upper?: number;
  middle?: number;
  lower?: number;
  pb?: number;
  width?: number;
}

export interface StochasticInput extends IndicatorInput {
  high: number[];
  low: number[];
  close: number[];
  signalPeriod?: number;
}

export interface StochasticOutput {
  k?: number;
  d?: number;
}

export interface RSIInput extends IndicatorInput {
  values: number[];
  period?: number;
}

export interface IchimokuInput {
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
}

export type NumberOrUndefined = number | undefined;