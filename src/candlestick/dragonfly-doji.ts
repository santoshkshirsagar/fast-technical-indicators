import { CandleData } from '../types';

export interface DragonflyDojiInput {
  candles: CandleData[];
}

export function dragonflydoji(input: DragonflyDojiInput): boolean[] {
  const { candles } = input;
  
  if (!candles || candles.length === 0) {
    return [];
  }

  const result: boolean[] = [];

  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];
    const { open, high, low, close } = candle;

    // Calculate body size and shadows
    const bodySize = Math.abs(close - open);
    const upperShadow = high - Math.max(open, close);
    const lowerShadow = Math.min(open, close) - low;
    const totalRange = high - low;

    // Dragonfly Doji criteria:
    // 1. Very small or no real body (open ≈ close)
    // 2. Long lower shadow
    // 3. Little or no upper shadow
    // 4. Open and close are at or near the high of the session

    const bodyTolerance = totalRange * 0.05; // 5% tolerance for body
    const shadowTolerance = totalRange * 0.05; // 5% tolerance for upper shadow

    const isDragonflyDoji = totalRange > 0 &&
                            bodySize <= bodyTolerance &&
                            upperShadow <= shadowTolerance &&
                            lowerShadow >= (totalRange * 0.6) && // Long lower shadow
                            Math.max(open, close) >= (high - shadowTolerance); // Body near high

    result.push(isDragonflyDoji);
  }

  return result;
}

export class DragonflyDojiPattern {
  private candles: CandleData[] = [];

  constructor(input?: DragonflyDojiInput) {
    if (input?.candles?.length) {
      this.candles = [...input.candles];
    }
  }

  nextValue(candle: CandleData): boolean {
    this.candles.push(candle);
    const result = dragonflydoji({ candles: [candle] });
    return result[0] || false;
  }

  getResult(): boolean[] {
    return dragonflydoji({ candles: this.candles });
  }

  static calculate = dragonflydoji;
}