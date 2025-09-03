import { vwap, VWAP } from '../src/volume/vwap';
import { vwap as referenceVWAP } from 'technicalindicators';

describe('VWAP (Volume Weighted Average Price)', () => {
  const testData = {
    high: [127.01, 127.62, 126.59, 127.35, 128.17, 128.43, 127.37, 126.42, 126.90, 126.85],
    low: [125.36, 126.16, 124.93, 126.09, 126.82, 126.48, 125.81, 124.83, 126.39, 125.72],
    close: [125.85, 126.48, 125.01, 127.02, 127.32, 127.11, 126.80, 126.13, 126.53, 125.81],
    volume: [25200, 30000, 25600, 32000, 23000, 40000, 36000, 20500, 23000, 27500]
  };

  test('functional VWAP should match reference implementation', () => {
    const ourResult = vwap({ 
      high: testData.high, 
      low: testData.low, 
      close: testData.close, 
      volume: testData.volume 
    });
    
    const referenceResult = referenceVWAP({
      high: testData.high,
      low: testData.low,
      close: testData.close,
      volume: testData.volume
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 4);
    }
  });

  test('class-based VWAP should work correctly', () => {
    const ourVWAP = new VWAP({ high: [], low: [], close: [], volume: [] });
    const referenceResult = referenceVWAP({
      high: testData.high,
      low: testData.low,
      close: testData.close,
      volume: testData.volume
    });
    
    let streamResults: number[] = [];
    
    for (let i = 0; i < testData.high.length; i++) {
      const result = ourVWAP.nextValue(testData.high[i], testData.low[i], testData.close[i], testData.volume[i]);
      if (result !== undefined) {
        streamResults.push(result);
      }
    }
    
    expect(streamResults).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < streamResults.length; i++) {
      expect(streamResults[i]).toBeCloseTo(referenceResult[i], 4);
    }
  });

  test('should handle edge cases', () => {
    const emptyResult = vwap({ high: [], low: [], close: [], volume: [] });
    expect(emptyResult).toEqual([]);
    
    const mismatchedLengthResult = vwap({ 
      high: [1], 
      low: [1], 
      close: [1], 
      volume: [100, 200] 
    });
    expect(mismatchedLengthResult).toEqual([]);
  });
});