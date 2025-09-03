import { ema, EMA } from '../src/moving-averages/ema';
import { ema as referenceEMA } from 'technicalindicators';

describe('EMA (Exponential Moving Average)', () => {
  const testData = [22.27, 22.19, 22.08, 22.17, 22.18, 22.13, 22.23, 22.43, 22.24, 22.29, 22.15, 22.39, 22.38, 22.61, 23.36, 24.05, 23.75, 23.83, 23.95, 23.63, 23.82, 23.87, 23.65, 23.19, 23.10, 23.33, 22.68, 23.10, 22.40, 22.17];
  const period = 10;

  test('functional EMA should match reference implementation', () => {
    const ourResult = ema({ period, values: testData });
    const referenceResult = referenceEMA({ period, values: testData });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 2);
    }
  });

  test('class-based EMA should match reference implementation', () => {
    const ourEMA = new EMA({ period, values: testData });
    const referenceResult = referenceEMA({ period, values: testData });
    
    expect(ourEMA.getResult()).toHaveLength(1);
    expect(ourEMA.getResult()[0]).toBeCloseTo(referenceResult[referenceResult.length - 1], 2);
  });

  test('streaming EMA should work correctly', () => {
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
      expect(streamResults[i]).toBeCloseTo(referenceResult[i], 2);
    }
  });

  test('should handle edge cases', () => {
    expect(ema({ period: 0, values: testData })).toEqual([]);
    expect(ema({ period: 31, values: testData })).toEqual([]);
    expect(ema({ period: 10, values: [] })).toEqual([]);
  });
});