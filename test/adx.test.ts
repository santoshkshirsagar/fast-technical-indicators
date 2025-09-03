import { adx, ADX } from '../src/directional-movement/adx';
import { adx as referenceADX } from 'technicalindicators';

describe('ADX (Average Directional Index)', () => {
  const testData = {
    high: [48.70, 48.72, 48.90, 48.87, 48.82, 49.05, 49.20, 49.35, 49.92, 50.19, 50.12, 49.66, 49.88, 50.19, 50.36, 50.57, 50.65, 50.43, 49.63, 49.88, 50.19, 50.36, 50.57, 50.65, 50.43, 49.63, 49.88, 50.19, 50.36],
    low: [47.79, 48.14, 48.39, 48.37, 48.24, 48.64, 48.94, 48.86, 49.50, 49.87, 49.20, 48.90, 49.43, 49.73, 49.26, 50.09, 50.30, 49.21, 48.98, 49.50, 49.87, 49.20, 50.09, 50.30, 49.21, 48.98, 49.50, 49.87, 49.20],
    close: [48.16, 48.61, 48.75, 48.63, 48.74, 49.03, 49.07, 49.32, 49.91, 50.13, 49.53, 49.50, 49.75, 50.03, 50.31, 50.52, 50.41, 49.34, 49.37, 49.68, 50.13, 49.53, 50.52, 50.41, 49.34, 49.37, 49.68, 50.13, 49.53]
  };
  
  const period = 14;

  test('functional ADX should work correctly', () => {
    const ourResult = adx({ 
      period, 
      high: testData.high, 
      low: testData.low, 
      close: testData.close 
    });
    
    // ADX should return array of numbers
    expect(Array.isArray(ourResult)).toBe(true);
    
    if (ourResult.length > 0) {
      // ADX values should be between 0 and 100
      ourResult.forEach(value => {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(100);
      });
    }
  });

  test('class-based ADX should work correctly', () => {
    const ourADX = new ADX({ period, high: [], low: [], close: [] });
    let streamResults: number[] = [];
    
    for (let i = 0; i < testData.high.length; i++) {
      const result = ourADX.nextValue(testData.high[i], testData.low[i], testData.close[i]);
      if (result !== undefined) {
        streamResults.push(result);
      }
    }
    
    expect(streamResults.length).toBeGreaterThan(0);
    
    // Check that ADX values are within expected range (0-100)
    streamResults.forEach(result => {
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    });
  });

  test('should handle edge cases', () => {
    const emptyResult = adx({ period: 14, high: [], low: [], close: [] });
    expect(emptyResult).toEqual([]);
    
    const shortDataResult = adx({ 
      period: 14, 
      high: [1], 
      low: [1], 
      close: [1] 
    });
    expect(shortDataResult).toEqual([]);
  });
});