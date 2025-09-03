import { IndicatorInput, NumberOrUndefined } from '../types';
import { rsi } from '../oscillators/rsi';
import { sma } from '../moving-averages/sma';

export interface StochasticRSIInput extends IndicatorInput {
  rsiPeriod: number;
  stochasticPeriod: number;
  kPeriod: number;
  dPeriod: number;
  values: number[];
}

export interface StochasticRSIOutput {
  stochrsi?: number;
  k?: number;
  d?: number;
}

export function stochasticrsi(input: StochasticRSIInput): StochasticRSIOutput[] {
  const { 
    rsiPeriod = 14, 
    stochasticPeriod = 14, 
    kPeriod = 3, 
    dPeriod = 3, 
    values 
  } = input;
  
  if (values.length < rsiPeriod + stochasticPeriod) {
    return [];
  }

  // Calculate RSI first
  const rsiValues = rsi({ period: rsiPeriod, values });
  
  if (rsiValues.length < stochasticPeriod) {
    return [];
  }

  const result: StochasticRSIOutput[] = [];
  const stochRSIValues: number[] = [];
  
  // Calculate Stochastic RSI
  for (let i = stochasticPeriod - 1; i < rsiValues.length; i++) {
    const rsiSlice = rsiValues.slice(i - stochasticPeriod + 1, i + 1);
    const highestRSI = Math.max(...rsiSlice);
    const lowestRSI = Math.min(...rsiSlice);
    
    let stochRSI: number;
    if (highestRSI === lowestRSI) {
      stochRSI = 0; // Avoid division by zero
    } else {
      stochRSI = ((rsiValues[i] - lowestRSI) / (highestRSI - lowestRSI)) * 100;
    }
    
    stochRSIValues.push(stochRSI);
  }
  
  // Calculate %K (SMA of Stochastic RSI)
  const kValues = sma({ period: kPeriod, values: stochRSIValues });
  
  // Calculate %D (SMA of %K)
  const dValues = sma({ period: dPeriod, values: kValues });
  
  // Combine results
  for (let i = 0; i < stochRSIValues.length; i++) {
    const kValue = i >= kPeriod - 1 ? kValues[i - kPeriod + 1] : undefined;
    const dValue = (kValues.length > 0 && i >= kPeriod + dPeriod - 2) 
      ? dValues[i - kPeriod - dPeriod + 2] : undefined;
    
    result.push({
      stochrsi: stochRSIValues[i],
      k: kValue,
      d: dValue
    });
  }
  
  return result;
}

export class StochasticRSI {
  private rsiPeriod: number;
  private stochasticPeriod: number;
  private kPeriod: number;
  private dPeriod: number;
  private values: number[] = [];
  private rsiCalculator: any;
  private rsiValues: number[] = [];
  private stochRSIValues: number[] = [];
  private kCalculator: any;
  private dCalculator: any;

  constructor(input: StochasticRSIInput) {
    this.rsiPeriod = input.rsiPeriod || 14;
    this.stochasticPeriod = input.stochasticPeriod || 14;
    this.kPeriod = input.kPeriod || 3;
    this.dPeriod = input.dPeriod || 3;
    
    // Create inline RSI calculator
    this.rsiCalculator = this.createRSICalculator(this.rsiPeriod);
    
    // Create SMA calculators for K and D
    this.kCalculator = this.createSMACalculator(this.kPeriod);
    this.dCalculator = this.createSMACalculator(this.dPeriod);
    
    if (input.values?.length) {
      input.values.forEach(value => this.nextValue(value));
    }
  }

  private createRSICalculator(period: number) {
    return {
      values: [] as number[],
      gains: [] as number[],
      losses: [] as number[],
      avgGain: 0,
      avgLoss: 0,
      initialized: false,
      period,
      nextValue: function(value: number): NumberOrUndefined {
        this.values.push(value);
        
        if (this.values.length === 1) return undefined;
        
        const diff = value - this.values[this.values.length - 2];
        const gain = diff > 0 ? diff : 0;
        const loss = diff < 0 ? Math.abs(diff) : 0;
        
        this.gains.push(gain);
        this.losses.push(loss);
        
        if (!this.initialized) {
          if (this.gains.length === this.period) {
            this.avgGain = this.gains.reduce((sum: number, g: number) => sum + g, 0) / this.period;
            this.avgLoss = this.losses.reduce((sum: number, l: number) => sum + l, 0) / this.period;
            this.initialized = true;
            
            const rs = this.avgLoss === 0 ? 100 : this.avgGain / this.avgLoss;
            return 100 - (100 / (1 + rs));
          }
          return undefined;
        }
        
        this.avgGain = ((this.avgGain * (this.period - 1)) + gain) / this.period;
        this.avgLoss = ((this.avgLoss * (this.period - 1)) + loss) / this.period;
        
        const rs = this.avgLoss === 0 ? 100 : this.avgGain / this.avgLoss;
        return 100 - (100 / (1 + rs));
      }
    };
  }

  private createSMACalculator(period: number) {
    return {
      values: [] as number[],
      period,
      nextValue: function(value: number): NumberOrUndefined {
        this.values.push(value);
        
        if (this.values.length > this.period) {
          this.values.shift();
        }
        
        if (this.values.length === this.period) {
          return this.values.reduce((sum: number, val: number) => sum + val, 0) / this.period;
        }
        
        return undefined;
      }
    };
  }

  nextValue(value: number): StochasticRSIOutput | undefined {
    this.values.push(value);
    
    // Calculate RSI
    const rsiValue = this.rsiCalculator.nextValue(value);
    if (rsiValue === undefined) return undefined;
    
    this.rsiValues.push(rsiValue);
    
    // Keep only required RSI values
    if (this.rsiValues.length > this.stochasticPeriod) {
      this.rsiValues.shift();
    }
    
    if (this.rsiValues.length < this.stochasticPeriod) {
      return undefined;
    }
    
    // Calculate Stochastic RSI
    const highestRSI = Math.max(...this.rsiValues);
    const lowestRSI = Math.min(...this.rsiValues);
    
    let stochRSI: number;
    if (highestRSI === lowestRSI) {
      stochRSI = 0;
    } else {
      stochRSI = ((rsiValue - lowestRSI) / (highestRSI - lowestRSI)) * 100;
    }
    
    this.stochRSIValues.push(stochRSI);
    
    // Calculate %K and %D
    const kValue = this.kCalculator.nextValue(stochRSI);
    const dValue = kValue !== undefined ? this.dCalculator.nextValue(kValue) : undefined;
    
    return {
      stochrsi: stochRSI,
      k: kValue,
      d: dValue
    };
  }

  getResult(): StochasticRSIOutput[] {
    if (this.stochRSIValues.length === 0) {
      return [];
    }
    
    const lastStochRSI = this.stochRSIValues[this.stochRSIValues.length - 1];
    const kResult = this.kCalculator.values.length === this.kPeriod 
      ? this.kCalculator.values.reduce((sum: number, val: number) => sum + val, 0) / this.kPeriod
      : undefined;
    const dResult = this.dCalculator.values.length === this.dPeriod
      ? this.dCalculator.values.reduce((sum: number, val: number) => sum + val, 0) / this.dPeriod
      : undefined;
    
    return [{
      stochrsi: lastStochRSI,
      k: kResult,
      d: dResult
    }];
  }

  static calculate = stochasticrsi;
}