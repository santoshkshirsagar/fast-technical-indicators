import { wma, WMA } from '../src/moving-averages/wma';
import { wma as referenceWMA } from 'technicalindicators';
import testDataRaw from './data.json';

describe('WMA (Weighted Moving Average)', () => {
  // Use all data points from data.json for testing
  const testDataArray = Array.isArray(testDataRaw) ? testDataRaw : [testDataRaw];
  const testData = testDataArray.map(d => d.close);
  const period = 20;

  const smallTestData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const smallPeriod = 4;

  test('functional WMA should match reference implementation with real market data', () => {
    const ourResult = wma({ period, values: testData });
    const referenceResult = referenceWMA({ period, values: testData });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    expect(ourResult).toHaveLength(testDataArray.length - period + 1);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 4);
    }
  });

  test('functional WMA should work with small test data', () => {
    const ourResult = wma({ period: smallPeriod, values: smallTestData });
    const referenceResult = referenceWMA({ period: smallPeriod, values: smallTestData });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 10);
    }
  });

  test('class-based WMA should work correctly with streaming data', () => {
    const ourWMA = new WMA({ period, values: [] });
    const referenceResult = referenceWMA({ period, values: testData });
    
    let streamResults: number[] = [];
    
    testData.forEach(value => {
      const result = ourWMA.nextValue(value);
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
    expect(wma({ period: 0, values: testData })).toEqual([]);
    expect(wma({ period: testData.length + 1, values: testData })).toEqual([]);
    expect(wma({ period: 5, values: [] })).toEqual([]);
  });
});