import { rsi, RSI } from '../src/oscillators/rsi';
import { rsi as referenceRSI } from 'technicalindicators';
import testDataRaw from './data.json';

describe('RSI (Relative Strength Index)', () => {
  // Use all data points from data.json for testing
  const testDataArray = Array.isArray(testDataRaw) ? testDataRaw : [testDataRaw];
  const testData = testDataArray.map(d => d.close);
  const period = 14;

  const smallTestData = [44.34, 44.09, 44.15, 43.61, 44.33, 44.83, 45.85, 46.08, 45.89, 46.03, 46.83, 47.69, 46.49, 46.26, 47.09, 46.66, 46.80, 46.23, 46.38, 46.33, 46.55, 45.88, 47.82, 47.23, 46.08, 43.67, 46.64, 46.67, 45.83, 45.38, 44.17];

  test('functional RSI should match reference implementation with real market data', () => {
    const ourResult = rsi({ period, values: testData });
    const referenceResult = referenceRSI({ period, values: testData });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    expect(ourResult).toHaveLength(testDataArray.length - period);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 2);
    }
  });

  test('functional RSI should work with small test data', () => {
    const ourResult = rsi({ period, values: smallTestData });
    const referenceResult = referenceRSI({ period, values: smallTestData });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 1);
    }
  });

  test('class-based RSI should work correctly with streaming data', () => {
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
      expect(streamResults[i]).toBeCloseTo(referenceResult[i], 2);
    }
  });

  test('should handle edge cases', () => {
    expect(rsi({ period: 0, values: testData })).toEqual([]);
    expect(rsi({ period: testData.length, values: testData })).toEqual([]);
    expect(rsi({ period: 14, values: [] })).toEqual([]);
  });
});