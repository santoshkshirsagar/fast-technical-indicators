export interface FibonacciInput {
  high: number;
  low: number;
  trend?: 'up' | 'down';
}

export interface FibonacciOutput {
  level: number;
  value: number;
  percentage: string;
}

// Standard Fibonacci retracement levels
const FIBONACCI_LEVELS = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];

// Fibonacci extension levels
const FIBONACCI_EXTENSION_LEVELS = [1.272, 1.414, 1.618, 2, 2.618];

export function fibonacci(input: FibonacciInput): FibonacciOutput[] {
  const { high, low, trend = 'down' } = input;
  
  if (high <= low) {
    throw new Error('High must be greater than low');
  }

  const range = high - low;
  const result: FibonacciOutput[] = [];

  // Calculate retracement levels
  for (const level of FIBONACCI_LEVELS) {
    let value: number;
    
    if (trend === 'down') {
      // In a downtrend, retracements are calculated from low upward
      value = low + (range * level);
    } else {
      // In an uptrend, retracements are calculated from high downward
      value = high - (range * level);
    }

    result.push({
      level,
      value,
      percentage: `${(level * 100).toFixed(1)}%`
    });
  }

  return result;
}

export function fibonacciExtensions(input: FibonacciInput): FibonacciOutput[] {
  const { high, low, trend = 'down' } = input;
  
  if (high <= low) {
    throw new Error('High must be greater than low');
  }

  const range = high - low;
  const result: FibonacciOutput[] = [];

  // Calculate extension levels
  for (const level of FIBONACCI_EXTENSION_LEVELS) {
    let value: number;
    
    if (trend === 'down') {
      // In a downtrend, extensions project further down from low
      value = low - (range * (level - 1));
    } else {
      // In an uptrend, extensions project further up from high
      value = high + (range * (level - 1));
    }

    result.push({
      level,
      value,
      percentage: `${(level * 100).toFixed(1)}%`
    });
  }

  return result;
}

export function fibonacciProjection(input: { prices: number[]; swingPoints: number[] }): FibonacciOutput[] {
  const { prices, swingPoints } = input;
  
  if (swingPoints.length < 3) {
    throw new Error('At least 3 swing points are required for projection');
  }

  const [pointA, pointB, pointC] = swingPoints;
  const moveAB = Math.abs(prices[pointB] - prices[pointA]);
  const moveBC = Math.abs(prices[pointC] - prices[pointB]);
  
  // Calculate projection ratios
  const ratios = [0.618, 0.786, 1, 1.272, 1.414, 1.618];
  const result: FibonacciOutput[] = [];
  
  // Determine trend direction
  const isUptrend = prices[pointC] > prices[pointA];
  
  for (const ratio of ratios) {
    const projectionDistance = moveAB * ratio;
    let value: number;
    
    if (isUptrend) {
      value = prices[pointC] + projectionDistance;
    } else {
      value = prices[pointC] - projectionDistance;
    }

    result.push({
      level: ratio,
      value,
      percentage: `${(ratio * 100).toFixed(1)}%`
    });
  }

  return result;
}

export class Fibonacci {
  private high: number;
  private low: number;
  private trend: 'up' | 'down';

  constructor(input: FibonacciInput) {
    this.high = input.high;
    this.low = input.low;
    this.trend = input.trend || 'down';
  }

  getRetracements(): FibonacciOutput[] {
    return fibonacci({
      high: this.high,
      low: this.low,
      trend: this.trend
    });
  }

  getExtensions(): FibonacciOutput[] {
    return fibonacciExtensions({
      high: this.high,
      low: this.low,
      trend: this.trend
    });
  }

  updateLevels(high: number, low: number, trend?: 'up' | 'down'): void {
    this.high = high;
    this.low = low;
    if (trend) {
      this.trend = trend;
    }
  }

  static calculate = fibonacci;
  static extensions = fibonacciExtensions;
  static projection = fibonacciProjection;
}