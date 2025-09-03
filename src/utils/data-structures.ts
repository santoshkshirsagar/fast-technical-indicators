import { CandleData } from '../types';

// FixedSizeLinkedList implementation for compatibility
export class FixedSizeLinkedList<T> {
  private data: T[] = [];
  private maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  push(item: T): void {
    if (this.data.length >= this.maxSize) {
      this.data.shift(); // Remove first element
    }
    this.data.push(item);
  }

  get(index: number): T | undefined {
    return this.data[index];
  }

  toArray(): T[] {
    return [...this.data];
  }

  get length(): number {
    return this.data.length;
  }

  shift(): T | undefined {
    return this.data.shift();
  }

  pop(): T | undefined {
    return this.data.pop();
  }

  isFull(): boolean {
    return this.data.length >= this.maxSize;
  }

  clear(): void {
    this.data = [];
  }

  getLast(n: number = 1): T[] {
    return this.data.slice(-n);
  }

  getFirst(n: number = 1): T[] {
    return this.data.slice(0, n);
  }
}

// CandleList implementation for compatibility
export class CandleList {
  private candles: CandleData[] = [];

  constructor(candles?: CandleData[]) {
    if (candles) {
      this.candles = [...candles];
    }
  }

  add(candle: CandleData): void {
    this.candles.push(candle);
  }

  get(index: number): CandleData | undefined {
    return this.candles[index];
  }

  getCandles(): CandleData[] {
    return [...this.candles];
  }

  get length(): number {
    return this.candles.length;
  }

  slice(start?: number, end?: number): CandleData[] {
    return this.candles.slice(start, end);
  }

  getLast(n: number = 1): CandleData[] {
    return this.candles.slice(-n);
  }

  getHigh(): number[] {
    return this.candles.map(c => c.high);
  }

  getLow(): number[] {
    return this.candles.map(c => c.low);
  }

  getOpen(): number[] {
    return this.candles.map(c => c.open);
  }

  getClose(): number[] {
    return this.candles.map(c => c.close);
  }

  getVolume(): number[] {
    return this.candles.map(c => c.volume || 0);
  }
}

// Sum class for compatibility  
export class Sum {
  private period: number;
  private values: number[] = [];

  constructor(input: { period: number; values?: number[] }) {
    this.period = input.period;
    if (input.values?.length) {
      input.values.forEach(value => this.nextValue(value));
    }
  }

  nextValue(value: number): number | undefined {
    this.values.push(value);

    if (this.values.length > this.period) {
      this.values.shift();
    }

    if (this.values.length === this.period) {
      return this.values.reduce((sum, val) => sum + val, 0);
    }

    return undefined;
  }

  getResult(): number[] {
    if (this.values.length < this.period) {
      return [];
    }
    return [this.values.reduce((sum, val) => sum + val, 0)];
  }

  static calculate = sum;
}

// CrossUp class for compatibility
export class CrossUp {
  private lineA: number[] = [];
  private lineB: number[] = [];

  constructor() {}

  nextValue(valueA: number, valueB: number): boolean {
    this.lineA.push(valueA);
    this.lineB.push(valueB);

    if (this.lineA.length < 2) {
      return false;
    }

    const prevA = this.lineA[this.lineA.length - 2];
    const prevB = this.lineB[this.lineB.length - 2];
    const currentA = valueA;
    const currentB = valueB;

    return prevA <= prevB && currentA > currentB;
  }

  static calculate = crossUp;
}

// CrossDown class for compatibility
export class CrossDown {
  private lineA: number[] = [];
  private lineB: number[] = [];

  constructor() {}

  nextValue(valueA: number, valueB: number): boolean {
    this.lineA.push(valueA);
    this.lineB.push(valueB);

    if (this.lineA.length < 2) {
      return false;
    }

    const prevA = this.lineA[this.lineA.length - 2];
    const prevB = this.lineB[this.lineB.length - 2];
    const currentA = valueA;
    const currentB = valueB;

    return prevA >= prevB && currentA < currentB;
  }

  static calculate = crossDown;
}

// Re-export from utils/index for backward compatibility
import { crossUp, crossDown, sum } from './index';
export { crossUp, crossDown, sum };