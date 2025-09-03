import { IndicatorInput, NumberOrUndefined } from '../types';

export interface VolumeProfileInput {
  close: number[];
  volume: number[];
  noOfBars?: number;
}

export interface VolumeProfileOutput {
  rangeStart: number;
  rangeEnd: number;
  volume: number;
  percentage: number;
}

export function volumeprofile(input: VolumeProfileInput): VolumeProfileOutput[] {
  const { close, volume, noOfBars = 14 } = input;
  
  if (close.length !== volume.length || close.length === 0) {
    return [];
  }

  const minPrice = Math.min(...close);
  const maxPrice = Math.max(...close);
  const priceRange = maxPrice - minPrice;
  
  if (priceRange === 0) {
    return [{
      rangeStart: minPrice,
      rangeEnd: maxPrice,
      volume: volume.reduce((sum, v) => sum + v, 0),
      percentage: 100
    }];
  }

  const barSize = priceRange / noOfBars;
  const volumeBars: number[] = new Array(noOfBars).fill(0);

  // Distribute volume into price bars
  for (let i = 0; i < close.length; i++) {
    const price = close[i];
    const vol = volume[i];
    
    // Determine which bar this price falls into
    let barIndex = Math.floor((price - minPrice) / barSize);
    
    // Handle edge case where price equals maxPrice
    if (barIndex >= noOfBars) {
      barIndex = noOfBars - 1;
    }
    
    volumeBars[barIndex] += vol;
  }

  const totalVolume = volume.reduce((sum, v) => sum + v, 0);
  const result: VolumeProfileOutput[] = [];

  // Create output
  for (let i = 0; i < noOfBars; i++) {
    const rangeStart = minPrice + (i * barSize);
    const rangeEnd = minPrice + ((i + 1) * barSize);
    const barVolume = volumeBars[i];
    const percentage = totalVolume > 0 ? (barVolume / totalVolume) * 100 : 0;

    if (barVolume > 0) {
      result.push({
        rangeStart,
        rangeEnd,
        volume: barVolume,
        percentage
      });
    }
  }

  return result;
}

export class VolumeProfile {
  private closeValues: number[] = [];
  private volumeValues: number[] = [];
  private noOfBars: number;

  constructor(input: VolumeProfileInput) {
    this.noOfBars = input.noOfBars || 14;
    
    if (input.close?.length && input.volume?.length) {
      for (let i = 0; i < Math.min(input.close.length, input.volume.length); i++) {
        this.nextValue(input.close[i], input.volume[i]);
      }
    }
  }

  nextValue(close: number, volume: number): void {
    this.closeValues.push(close);
    this.volumeValues.push(volume);
  }

  getResult(): VolumeProfileOutput[] {
    return volumeprofile({
      close: this.closeValues,
      volume: this.volumeValues,
      noOfBars: this.noOfBars
    });
  }

  static calculate = volumeprofile;
}