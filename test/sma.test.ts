import { sma, SMA } from '../src/moving-averages/sma';
import { sma as referenceSMA } from 'technicalindicators';

describe('SMA (Simple Moving Average)', () => {
  const testData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const period = 4;

  test('functional SMA should match reference implementation', () => {
    const ourResult = sma({ period, values: testData });
    const referenceResult = referenceSMA({ period, values: testData });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 10);
    }
  });

  test('class-based SMA should match reference implementation', () => {
    const ourSMA = new SMA({ period, values: testData });
    const referenceResult = referenceSMA({ period, values: testData });
    
    expect(ourSMA.getResult()).toHaveLength(1);
    expect(ourSMA.getResult()[0]).toBeCloseTo(referenceResult[referenceResult.length - 1], 10);
  });

  test('streaming SMA should work correctly', () => {
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
      expect(streamResults[i]).toBeCloseTo(referenceResult[i], 10);
    }
  });

  test('should handle edge cases', () => {
    expect(sma({ period: 0, values: testData })).toEqual([]);
    expect(sma({ period: 11, values: testData })).toEqual([]);
    expect(sma({ period: 5, values: [] })).toEqual([]);
  });
});