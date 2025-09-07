import { RSIInput, NumberOrUndefined } from '../types';

export function rsi(input: RSIInput): number[] {
  const { period = 14, values } = input;
  
  if (period <= 0 || values.length <= period) {
    return [];
  }

  const result: number[] = [];
  const gains: number[] = [];
  const losses: number[] = [];
  
  // Calculate initial gains and losses
  for (let i = 1; i < values.length; i++) {
    const difference = values[i] - values[i - 1];
    gains.push(difference > 0 ? difference : 0);
    losses.push(difference < 0 ? Math.abs(difference) : 0);
  }
  
  // Calculate initial average gain and loss (SMA)
  let avgGain = gains.slice(0, period).reduce((sum, gain) => sum + gain, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((sum, loss) => sum + loss, 0) / period;
  
  // Calculate first RSI
  let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  result.push(parseFloat((100 - (100 / (1 + rs))).toFixed(2)));
  
  // Calculate subsequent RSI using Wilder's smoothing
  for (let i = period; i < gains.length; i++) {
    avgGain = ((avgGain * (period - 1)) + gains[i]) / period;
    avgLoss = ((avgLoss * (period - 1)) + losses[i]) / period;
    
    rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    result.push(parseFloat((100 - (100 / (1 + rs))).toFixed(2)));
  }
  
  return result;
}

export class RSI {
  private period: number;
  private values: number[] = [];
  private gains: number[] = [];
  private losses: number[] = [];
  private avgGain: number = 0;
  private avgLoss: number = 0;
  private initialized: boolean = false;
  private count: number = 0;

  constructor(input: RSIInput) {
    this.period = input.period || 14;
    
    if (input.values?.length) {
      input.values.forEach(value => this.nextValue(value));
    }
  }

  nextValue(value: number): NumberOrUndefined {
    this.values.push(value);
    this.count++;

    if (this.values.length === 1) {
      return undefined; // Need at least 2 values to calculate difference
    }

    const difference = value - this.values[this.values.length - 2];
    const gain = difference > 0 ? difference : 0;
    const loss = difference < 0 ? Math.abs(difference) : 0;

    this.gains.push(gain);
    this.losses.push(loss);

    if (!this.initialized) {
      if (this.gains.length === this.period) {
        // Calculate initial average using SMA
        this.avgGain = this.gains.reduce((sum, g) => sum + g, 0) / this.period;
        this.avgLoss = this.losses.reduce((sum, l) => sum + l, 0) / this.period;
        this.initialized = true;
        
        const rs = this.avgLoss === 0 ? 100 : this.avgGain / this.avgLoss;
        return parseFloat((100 - (100 / (1 + rs))).toFixed(2));
      }
      return undefined;
    }

    // Use Wilder's smoothing for subsequent values
    this.avgGain = ((this.avgGain * (this.period - 1)) + gain) / this.period;
    this.avgLoss = ((this.avgLoss * (this.period - 1)) + loss) / this.period;

    const rs = this.avgLoss === 0 ? 100 : this.avgGain / this.avgLoss;
    return parseFloat((100 - (100 / (1 + rs))).toFixed(2));
  }

  getResult(): number[] {
    if (!this.initialized) {
      return [];
    }
    
    const rs = this.avgLoss === 0 ? 100 : this.avgGain / this.avgLoss;
    return [parseFloat((100 - (100 / (1 + rs))).toFixed(2))];
  }

  static calculate = rsi;
}