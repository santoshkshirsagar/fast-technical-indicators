import { IndicatorInput, NumberOrUndefined } from '../types';

export interface PSARInput extends IndicatorInput {
  high: number[];
  low: number[];
  step?: number;
  max?: number;
}

export function psar(input: PSARInput): number[] {
  const { high, low, step = 0.02, max = 0.2 } = input;
  
  if (high.length !== low.length || high.length < 1) {
    return [];
  }

  const result: number[] = [];
  let curr: {high: number, low: number} | undefined;
  let extreme: number | undefined;
  let sar: number | undefined;
  let furthest: {high: number, low: number} | undefined;
  let up = true;
  let accel = step;
  let prev: {high: number, low: number} | undefined;

  // Process each period
  for (let i = 0; i < high.length; i++) {
    curr = { high: high[i], low: low[i] };

    if (prev && curr && sar !== undefined && extreme !== undefined && furthest !== undefined) {
      sar = sar + accel * (extreme - sar);
      
      if (up) {
        sar = Math.min(sar, furthest.low, prev.low);
        if (curr.high > extreme) {
          extreme = curr.high;
          accel = Math.min(accel + step, max);
        }
      } else {
        sar = Math.max(sar, furthest.high, prev.high);
        if (curr.low < extreme) {
          extreme = curr.low;
          accel = Math.min(accel + step, max);
        }
      }
      
      if ((up && curr.low < sar) || (!up && curr.high > sar)) {
        accel = step;
        sar = extreme;
        up = !up;
        extreme = !up ? curr.low : curr.high;
      }
    } else {
      // Initialize on first data point
      sar = curr.low;
      extreme = curr.high;
    }

    furthest = prev || curr;
    if (curr) {
      prev = curr;
    }
    
    result.push(sar!);
  }

  return result;
}

export class PSAR {
  private step: number;
  private max: number;
  private curr: {high: number, low: number} | undefined;
  private extreme: number | undefined;
  private sar: number | undefined;
  private furthest: {high: number, low: number} | undefined;
  private up: boolean = true;
  private accel: number;
  private prev: {high: number, low: number} | undefined;
  private results: number[] = [];

  constructor(input: PSARInput) {
    this.step = input.step || 0.02;
    this.max = input.max || 0.2;
    this.accel = this.step;
  }

  nextValue(high: number, low: number): NumberOrUndefined {
    this.curr = { high, low };

    if (this.prev) {
      if (this.prev && this.curr) {
        this.sar = this.sar! + this.accel * (this.extreme! - this.sar!);
        
        if (this.up) {
          this.sar = Math.min(this.sar, this.furthest!.low, this.prev.low);
          if (this.curr.high > this.extreme!) {
            this.extreme = this.curr.high;
            this.accel = Math.min(this.accel + this.step, this.max);
          }
        } else {
          this.sar = Math.max(this.sar, this.furthest!.high, this.prev.high);
          if (this.curr.low < this.extreme!) {
            this.extreme = this.curr.low;
            this.accel = Math.min(this.accel + this.step, this.max);
          }
        }
        
        if ((this.up && this.curr.low < this.sar) || (!this.up && this.curr.high > this.sar)) {
          this.accel = this.step;
          this.sar = this.extreme!;
          this.up = !this.up;
          this.extreme = !this.up ? this.curr.low : this.curr.high;
        }
      }
    } else {
      // Initialize on first data point
      this.sar = this.curr.low;
      this.extreme = this.curr.high;
    }

    this.furthest = this.prev || this.curr;
    if (this.curr) {
      this.prev = this.curr;
    }
    
    this.results.push(this.sar!);
    return this.sar;
  }

  getResult(): number[] {
    return this.results;
  }

  static calculate = psar;
}