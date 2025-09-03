import { wema, WEMA } from '../src/moving-averages/wema';
import { wema as referenceWEMA } from 'technicalindicators';

describe('WEMA (Wilder\'s Exponential Moving Average)', () => {
  const testData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const period = 5;

  test('functional WEMA should match reference implementation', () => {
    const ourResult = wema({ period, values: testData });
    const referenceResult = referenceWEMA({ period, values: testData });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 6);
    }
  });

  test('class-based WEMA should work correctly', () => {
    const ourWEMA = new WEMA({ period, values: [] });
    const referenceResult = referenceWEMA({ period, values: testData });
    
    let streamResults: number[] = [];
    
    for (let i = 0; i < testData.length; i++) {
      const result = ourWEMA.nextValue(testData[i]);
      if (result !== undefined) {
        streamResults.push(result);
      }
    }
    
    expect(streamResults).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < streamResults.length; i++) {
      expect(streamResults[i]).toBeCloseTo(referenceResult[i], 6);
    }
  });

  test('should handle edge cases', () => {
    expect(wema({ period: 0, values: testData })).toEqual([]);
    expect(wema({ period: 16, values: testData })).toEqual([]);
    expect(wema({ period: 5, values: [] })).toEqual([]);
  });
});