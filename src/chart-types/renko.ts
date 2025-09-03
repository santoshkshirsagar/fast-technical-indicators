import { CandleData } from '../types';

export interface RenkoInput {
  candles: CandleData[];
  brickSize: number;
}

export interface RenkoOutput {
  open: number;
  close: number;
  high: number;
  low: number;
  trend: 1 | -1; // 1 for up, -1 for down
}

export function renko(input: RenkoInput): RenkoOutput[] {
  const { candles, brickSize } = input;
  
  if (!candles || candles.length === 0 || brickSize <= 0) {
    return [];
  }

  const result: RenkoOutput[] = [];
  let currentBrick: RenkoOutput | null = null;
  
  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];
    const price = candle.close; // Use close price for Renko calculation

    if (currentBrick === null) {
      // Initialize first brick
      currentBrick = {
        open: price,
        close: price + brickSize,
        high: price + brickSize,
        low: price,
        trend: 1
      };
      result.push({ ...currentBrick });
      continue;
    }

    // Calculate how many bricks we need to add
    let priceDiff: number;
    let bricksToAdd: number;
    let newTrend: 1 | -1;

    if (currentBrick.trend === 1) {
      // Uptrend: check for continuation or reversal
      if (price >= currentBrick.close + brickSize) {
        // Continue uptrend
        priceDiff = price - currentBrick.close;
        bricksToAdd = Math.floor(priceDiff / brickSize);
        newTrend = 1;
      } else if (price <= currentBrick.open - brickSize) {
        // Reversal to downtrend
        priceDiff = currentBrick.open - price;
        bricksToAdd = Math.floor(priceDiff / brickSize);
        newTrend = -1;
      } else {
        // No new bricks
        continue;
      }
    } else {
      // Downtrend: check for continuation or reversal
      if (price <= currentBrick.close - brickSize) {
        // Continue downtrend
        priceDiff = currentBrick.close - price;
        bricksToAdd = Math.floor(priceDiff / brickSize);
        newTrend = -1;
      } else if (price >= currentBrick.open + brickSize) {
        // Reversal to uptrend
        priceDiff = price - currentBrick.open;
        bricksToAdd = Math.floor(priceDiff / brickSize);
        newTrend = 1;
      } else {
        // No new bricks
        continue;
      }
    }

    // Add new bricks
    for (let j = 0; j < bricksToAdd; j++) {
      let brickOpen: number;
      let brickClose: number;

      if (newTrend === 1) {
        // Up brick
        if (currentBrick.trend === -1 && j === 0) {
          // First brick after reversal from downtrend
          brickOpen = currentBrick.open;
        } else {
          // Continuation or subsequent bricks
          brickOpen = currentBrick.close;
        }
        brickClose = brickOpen + brickSize;
      } else {
        // Down brick
        if (currentBrick.trend === 1 && j === 0) {
          // First brick after reversal from uptrend
          brickOpen = currentBrick.open;
        } else {
          // Continuation or subsequent bricks
          brickOpen = currentBrick.close;
        }
        brickClose = brickOpen - brickSize;
      }

      currentBrick = {
        open: brickOpen,
        close: brickClose,
        high: Math.max(brickOpen, brickClose),
        low: Math.min(brickOpen, brickClose),
        trend: newTrend
      };

      result.push({ ...currentBrick });
    }
  }

  return result;
}

export class Renko {
  private brickSize: number;
  private candles: CandleData[] = [];

  constructor(input: RenkoInput) {
    this.brickSize = input.brickSize;
    
    if (input.candles?.length) {
      input.candles.forEach(candle => this.nextValue(candle));
    }
  }

  nextValue(candle: CandleData): RenkoOutput[] {
    this.candles.push(candle);
    return renko({ candles: this.candles, brickSize: this.brickSize });
  }

  getResult(): RenkoOutput[] {
    return renko({ candles: this.candles, brickSize: this.brickSize });
  }

  static calculate = renko;
}