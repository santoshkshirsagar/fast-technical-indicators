import { rsi, RSI } from '../src/oscillators/rsi';
import { rsi as referenceRSI } from 'technicalindicators';

describe('RSI (Relative Strength Index)', () => {
  const testData = [44.34, 44.09, 44.15, 43.61, 44.33, 44.83, 45.85, 46.08, 45.89, 46.03, 46.83, 47.69, 46.49, 46.26, 47.09, 46.66, 46.80, 46.23, 46.38, 46.33, 46.55, 45.88, 47.82, 47.23, 46.08, 43.67, 46.64, 46.67, 45.83, 45.38, 44.17];
  const period = 14;

  test('functional RSI should match reference implementation', () => {
    const ourResult = rsi({ period, values: testData });
    const referenceResult = referenceRSI({ period, values: testData });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 1);
    }
  });

  test('class-based RSI should match reference implementation', () => {
    const ourRSI = new RSI({ period, values: testData });
    const referenceResult = referenceRSI({ period, values: testData });
    
    expect(ourRSI.getResult()).toHaveLength(1);
    expect(ourRSI.getResult()[0]).toBeCloseTo(referenceResult[referenceResult.length - 1], 1);
  });

  test('streaming RSI should work correctly', () => {
    const ourRSI = new RSI({ period, values: [] });
    const referenceResult = referenceRSI({ period, values: testData });
    
    let streamResults: number[] = [];
    
    testData.forEach(value => {
      const result = ourRSI.nextValue(value);
      if (result !== undefined) {
        streamResults.push(result);
      }
    });
    
    expect(streamResults).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < streamResults.length; i++) {
      expect(streamResults[i]).toBeCloseTo(referenceResult[i], 1);
    }
  });

  test('should handle edge cases', () => {
    expect(rsi({ period: 0, values: testData })).toEqual([]);
    expect(rsi({ period: testData.length, values: testData })).toEqual([]);
    expect(rsi({ period: 14, values: [] })).toEqual([]);
  });
});