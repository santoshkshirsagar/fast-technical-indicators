import { IndicatorInput, NumberOrUndefined } from '../types';

export interface LinearRegressionInput extends IndicatorInput {
  period: number;
  values: number[];
}

export interface LinearRegressionOutput {
  slope?: number;
  intercept?: number;
  forecast?: number;
  rSquared?: number;
}

function calculateLinearRegression(values: number[], period: number): LinearRegressionOutput {
  if (values.length < period) {
    return {};
  }
  
  const data = values.slice(-period);
  const n = data.length;
  
  // Calculate x values (time periods: 0, 1, 2, ..., n-1)
  const xSum = (n * (n - 1)) / 2; // Sum of 0+1+2+...+(n-1)
  const xSumSquared = (n * (n - 1) * (2 * n - 1)) / 6; // Sum of 0²+1²+2²+...+(n-1)²
  const ySum = data.reduce((sum, value) => sum + value, 0);
  
  // Calculate xy sum
  let xySum = 0;
  for (let i = 0; i < n; i++) {
    xySum += i * data[i];
  }
  
  // Calculate slope (m) and intercept (b) for y = mx + b
  const slope = (n * xySum - xSum * ySum) / (n * xSumSquared - xSum * xSum);
  const intercept = (ySum - slope * xSum) / n;
  
  // Calculate forecast (next value)
  const forecast = slope * n + intercept;
  
  // Calculate R-squared (coefficient of determination)
  const yMean = ySum / n;
  let ssTotal = 0;
  let ssResidual = 0;
  
  for (let i = 0; i < n; i++) {
    const predicted = slope * i + intercept;
    ssTotal += Math.pow(data[i] - yMean, 2);
    ssResidual += Math.pow(data[i] - predicted, 2);
  }
  
  const rSquared = 1 - (ssResidual / ssTotal);
  
  return {
    slope,
    intercept,
    forecast,
    rSquared
  };
}

export function linearregression(input: LinearRegressionInput): LinearRegressionOutput[] {
  const { period = 14, values } = input;
  
  if (values.length < period) {
    return [];
  }

  const result: LinearRegressionOutput[] = [];
  
  for (let i = period - 1; i < values.length; i++) {
    const subset = values.slice(i - period + 1, i + 1);
    const regression = calculateLinearRegression(subset, period);
    result.push(regression);
  }
  
  return result;
}

export class LinearRegression {
  private period: number;
  private values: number[] = [];

  constructor(input: LinearRegressionInput) {
    this.period = input.period || 14;
  }

  nextValue(value: number): LinearRegressionOutput | undefined {
    this.values.push(value);

    // Need at least period values to calculate
    if (this.values.length < this.period) {
      return undefined;
    }

    // Keep only the last 'period' values for efficiency
    if (this.values.length > this.period) {
      this.values.shift();
    }
    
    return calculateLinearRegression(this.values, this.period);
  }

  getResult(): LinearRegressionOutput[] {
    if (this.values.length < this.period) {
      return [];
    }
    
    const result = calculateLinearRegression(this.values, this.period);
    return [result];
  }

  static calculate = linearregression;
}