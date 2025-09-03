import { wma, WMA } from '../src/moving-averages/wma';
import { wma as referenceWMA } from 'technicalindicators';

describe('WMA (Weighted Moving Average)', () => {
  const testData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const period = 4;

  test('functional WMA should match reference implementation', () => {
    const ourResult = wma({ period, values: testData });
    const referenceResult = referenceWMA({ period, values: testData });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 10);
    }
  });

  test('class-based WMA should work correctly', () => {
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
      expect(streamResults[i]).toBeCloseTo(referenceResult[i], 10);
    }
  });

  test('should handle edge cases', () => {
    expect(wma({ period: 0, values: testData })).toEqual([]);
    expect(wma({ period: 11, values: testData })).toEqual([]);
    expect(wma({ period: 5, values: [] })).toEqual([]);
  });
});