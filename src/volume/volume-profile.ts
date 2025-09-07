import { IndicatorInput } from '../types';

export interface VolumeProfileInput extends IndicatorInput {
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  volume: number[];
  noOfBars?: number;
}

export interface VolumeProfileOutput {
  rangeStart: number;
  rangeEnd: number;
  bullishVolume: number;
  bearishVolume: number;
  totalVolume: number;
}

// Helper function to check if two ranges overlap (exactly like technicalindicators)
function priceFallsBetweenBarRange(low: number, high: number, low1: number, high1: number): boolean {
  return (low <= low1 && high >= low1) || (low1 <= low && high1 >= low);
}

export function volumeprofile(input: VolumeProfileInput): VolumeProfileOutput[] {
  const { open, high, low, close, volume, noOfBars = 14 } = input;
  
  if (!open || !high || !low || !close || !volume ||
      open.length !== high.length || 
      high.length !== low.length || 
      low.length !== close.length || 
      close.length !== volume.length || 
      close.length === 0) {
    return [];
  }

  const result: VolumeProfileOutput[] = [];
  
  // Find price range across all OHLC data (exactly like reference)
  const max = Math.max(...high, ...low, ...close, ...open);
  const min = Math.min(...high, ...low, ...close, ...open);
  const barRange = (max - min) / noOfBars;
  
  let lastEnd = min;
  
  // Create each volume profile bar
  for (let i = 0; i < noOfBars; i++) {
    const rangeStart = lastEnd;
    const rangeEnd = rangeStart + barRange;
    lastEnd = rangeEnd;
    
    let bullishVolume = 0;
    let bearishVolume = 0;
    let totalVolume = 0;
    
    // Check each price bar (candle) against this volume profile bar
    for (let priceBar = 0; priceBar < high.length; priceBar++) {
      const priceBarStart = low[priceBar];
      const priceBarEnd = high[priceBar];
      const priceBarOpen = open[priceBar];
      const priceBarClose = close[priceBar];
      const priceBarVolume = volume[priceBar];
      
      // Check if this candle's range overlaps with current volume profile bar range
      if (priceFallsBetweenBarRange(rangeStart, rangeEnd, priceBarStart, priceBarEnd)) {
        totalVolume = totalVolume + priceBarVolume;
        
        // Note: Reference uses open > close for bearish (opposite of what I initially thought)
        if (priceBarOpen > priceBarClose) {
          bearishVolume = bearishVolume + priceBarVolume;
        } else {
          bullishVolume = bullishVolume + priceBarVolume;
        }
      }
    }
    
    // Always include all bars (even with 0 volume) - but we'll filter them out later if needed
    result.push({
      rangeStart,
      rangeEnd,
      bullishVolume,
      bearishVolume,
      totalVolume
    });
  }
  
  return result;
}

export class VolumeProfile {
  private openValues: number[] = [];
  private highValues: number[] = [];
  private lowValues: number[] = [];
  private closeValues: number[] = [];
  private volumeValues: number[] = [];
  private noOfBars: number;

  constructor(input: VolumeProfileInput) {
    this.noOfBars = input.noOfBars || 14;
    
    if (input.open?.length && input.high?.length && input.low?.length && 
        input.close?.length && input.volume?.length) {
      const minLength = Math.min(
        input.open.length,
        input.high.length, 
        input.low.length,
        input.close.length,
        input.volume.length
      );
      
      for (let i = 0; i < minLength; i++) {
        this.nextValue(input.open[i], input.high[i], input.low[i], input.close[i], input.volume[i]);
      }
    }
  }

  nextValue(open: number, high: number, low: number, close: number, volume: number): void {
    this.openValues.push(open);
    this.highValues.push(high);
    this.lowValues.push(low);
    this.closeValues.push(close);
    this.volumeValues.push(volume);
  }

  getResult(): VolumeProfileOutput[] {
    return volumeprofile({
      open: this.openValues,
      high: this.highValues,
      low: this.lowValues,
      close: this.closeValues,
      volume: this.volumeValues,
      noOfBars: this.noOfBars
    });
  }

  static calculate = volumeprofile;
}