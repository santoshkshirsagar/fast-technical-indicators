import { wema, WEMA } from '../src/moving-averages/wema';
import { wema as referenceWEMA } from 'technicalindicators';
import testDataRaw from './data.json';

describe('WEMA (Wilder\'s Exponential Moving Average)', () => {
  // Use all data points from data.json for testing
  const testDataArray = Array.isArray(testDataRaw) ? testDataRaw : [testDataRaw];
  const wemaTestData = testDataArray.map(d => d.close);
  const period = 5;

  const smallTestData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  test('functional WEMA should match reference implementation with real market data', () => {
    const ourResult = wema({ period, values: wemaTestData });
    const referenceResult = referenceWEMA({ period, values: wemaTestData });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    expect(ourResult).toHaveLength(wemaTestData.length - period + 1);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 4);
    }
  });

  test('functional WEMA should work with small test data', () => {
    const ourResult = wema({ period, values: smallTestData });
    const referenceResult = referenceWEMA({ period, values: smallTestData });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 4);
    }
  });

  test('class-based WEMA should work correctly with streaming data', () => {
    const ourWEMA = new WEMA({ period, values: [] });
    const referenceResult = referenceWEMA({ period, values: wemaTestData });
    
    let streamResults: number[] = [];
    
    for (let i = 0; i < wemaTestData.length; i++) {
      const result = ourWEMA.nextValue(wemaTestData[i]);
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
    expect(wema({ period: 0, values: wemaTestData })).toEqual([]);
    expect(wema({ period: wemaTestData.length + 1, values: wemaTestData })).toEqual([]);
    expect(wema({ period: 5, values: [] })).toEqual([]);
  });
});