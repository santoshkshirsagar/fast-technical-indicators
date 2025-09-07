import { sma, SMA } from '../src/moving-averages/sma';
import { sma as referenceSMA } from 'technicalindicators';
import testDataRaw from './data.json';

describe('SMA (Simple Moving Average)', () => {
  // Use all data points from data.json for testing
  const testDataArray = Array.isArray(testDataRaw) ? testDataRaw : [testDataRaw];
  const testData = testDataArray.map(d => d.close);
  const period = 20;

  const smallTestData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const smallPeriod = 4;

  test('functional SMA should match reference implementation with real market data', () => {
    const ourResult = sma({ period, values: testData });
    const referenceResult = referenceSMA({ period, values: testData });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    expect(ourResult).toHaveLength(testDataArray.length - period + 1);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 4);
    }
  });

  test('functional SMA should work with small test data', () => {
    const ourResult = sma({ period: smallPeriod, values: smallTestData });
    const referenceResult = referenceSMA({ period: smallPeriod, values: smallTestData });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 10);
    }
  });

  test('class-based SMA should work correctly with streaming data', () => {
    const ourSMA = new SMA({ period, values: [] });
    const referenceResult = referenceSMA({ period, values: testData });
    
    let streamResults: number[] = [];
    
    testData.forEach(value => {
      const result = ourSMA.nextValue(value);
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
    expect(sma({ period: 0, values: testData })).toEqual([]);
    expect(sma({ period: testData.length + 1, values: testData })).toEqual([]);
    expect(sma({ period: 5, values: [] })).toEqual([]);
  });
});