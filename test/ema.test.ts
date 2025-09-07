import { ema, EMA } from '../src/moving-averages/ema';
import { ema as referenceEMA } from 'technicalindicators';
import testDataRaw from './data.json';

describe('EMA (Exponential Moving Average)', () => {
  // Use all data points from data.json for testing
  const testDataArray = Array.isArray(testDataRaw) ? testDataRaw : [testDataRaw];
  const testData = testDataArray.map(d => d.close);
  const period = 10;

  const smallTestData = [22.27, 22.19, 22.08, 22.17, 22.18, 22.13, 22.23, 22.43, 22.24, 22.29, 22.15, 22.39, 22.38, 22.61, 23.36, 24.05, 23.75, 23.83, 23.95, 23.63, 23.82, 23.87, 23.65, 23.19, 23.10, 23.33, 22.68, 23.10, 22.40, 22.17];

  test('functional EMA should match reference implementation with real market data', () => {
    const ourResult = ema({ period, values: testData });
    const referenceResult = referenceEMA({ period, values: testData });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    expect(ourResult).toHaveLength(testDataArray.length - period + 1);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 4);
    }
  });

  test('functional EMA should work with small test data', () => {
    const ourResult = ema({ period, values: smallTestData });
    const referenceResult = referenceEMA({ period, values: smallTestData });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 2);
    }
  });

  test('class-based EMA should work correctly with streaming data', () => {
    const ourEMA = new EMA({ period, values: [] });
    const referenceResult = referenceEMA({ period, values: testData });
    
    let streamResults: number[] = [];
    
    testData.forEach(value => {
      const result = ourEMA.nextValue(value);
      if (result !== undefined) {
        streamResults.push(result);
      }
    });
    
    expect(streamResults).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < streamResults.length; i++) {
      expect(streamResults[i]).toBeCloseTo(referenceResult[i], 4);
    }
  });

  test('should handle edge cases', () => {
    expect(ema({ period: 0, values: testData })).toEqual([]);
    expect(ema({ period: testData.length + 1, values: testData })).toEqual([]);
    expect(ema({ period: 10, values: [] })).toEqual([]);
  });
});