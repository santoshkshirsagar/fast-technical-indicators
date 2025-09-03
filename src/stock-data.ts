import { CandleData } from './types';

export interface StockDataInput {
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  volume?: number[];
  timestamp?: (string | number | Date)[];
}

export interface StockDataPoint {
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
  timestamp?: string | number | Date;
}

export class StockData {
  private data: StockDataPoint[] = [];

  constructor(input?: StockDataInput) {
    if (input) {
      this.loadData(input);
    }
  }

  loadData(input: StockDataInput): void {
    const { open, high, low, close, volume, timestamp } = input;

    // Validate data consistency
    if (open.length !== high.length || 
        high.length !== low.length || 
        low.length !== close.length) {
      throw new Error('OHLC arrays must have the same length');
    }

    if (volume && volume.length !== close.length) {
      throw new Error('Volume array length must match OHLC arrays');
    }

    if (timestamp && timestamp.length !== close.length) {
      throw new Error('Timestamp array length must match OHLC arrays');
    }

    this.data = [];
    for (let i = 0; i < open.length; i++) {
      const point: StockDataPoint = {
        open: open[i],
        high: high[i],
        low: low[i],
        close: close[i]
      };

      if (volume) {
        point.volume = volume[i];
      }

      if (timestamp) {
        point.timestamp = timestamp[i];
      }

      this.data.push(point);
    }
  }

  addDataPoint(point: StockDataPoint): void {
    this.data.push(point);
  }

  getCandles(): CandleData[] {
    return this.data.map(point => ({
      open: point.open,
      high: point.high,
      low: point.low,
      close: point.close
    }));
  }

  getOpen(): number[] {
    return this.data.map(point => point.open);
  }

  getHigh(): number[] {
    return this.data.map(point => point.high);
  }

  getLow(): number[] {
    return this.data.map(point => point.low);
  }

  getClose(): number[] {
    return this.data.map(point => point.close);
  }

  getVolume(): number[] {
    return this.data.map(point => point.volume || 0);
  }

  getTimestamp(): (string | number | Date)[] {
    return this.data.map(point => point.timestamp || '');
  }

  getDataPoints(): StockDataPoint[] {
    return [...this.data];
  }

  getLastDataPoint(): StockDataPoint | undefined {
    return this.data[this.data.length - 1];
  }

  getDataPoint(index: number): StockDataPoint | undefined {
    return this.data[index];
  }

  length(): number {
    return this.data.length;
  }

  slice(start?: number, end?: number): StockData {
    const slicedData = this.data.slice(start, end);
    const newStockData = new StockData();
    newStockData.data = slicedData;
    return newStockData;
  }

  reverse(): StockData {
    const reversedData = [...this.data].reverse();
    const newStockData = new StockData();
    newStockData.data = reversedData;
    return newStockData;
  }

  // Utility methods for common operations
  static fromArray(candles: CandleData[]): StockData {
    const stockData = new StockData();
    stockData.data = candles.map(candle => ({
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close
    }));
    return stockData;
  }

  static fromOHLC(open: number[], high: number[], low: number[], close: number[]): StockData {
    return new StockData({ open, high, low, close });
  }

  // Validation methods
  isValid(): boolean {
    return this.data.every(point => 
      point.high >= Math.max(point.open, point.close) &&
      point.low <= Math.min(point.open, point.close) &&
      point.high >= point.low
    );
  }

  validateData(): string[] {
    const errors: string[] = [];
    
    this.data.forEach((point, index) => {
      if (point.high < Math.max(point.open, point.close)) {
        errors.push(`Data point ${index}: High (${point.high}) is less than max of open/close`);
      }
      if (point.low > Math.min(point.open, point.close)) {
        errors.push(`Data point ${index}: Low (${point.low}) is greater than min of open/close`);
      }
      if (point.high < point.low) {
        errors.push(`Data point ${index}: High (${point.high}) is less than low (${point.low})`);
      }
    });

    return errors;
  }
}