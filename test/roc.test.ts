import { roc, ROC } from '../src/momentum/roc';
import { roc as referenceROC } from 'technicalindicators';
import testDataRaw from './data.json';

describe('ROC (Rate of Change)', () => {
  // Use all data points from data.json for testing
  const testDataArray = Array.isArray(testDataRaw) ? testDataRaw : [testDataRaw];
  const rocTestData = testDataArray.map(d => d.close);
  const period = 10;

  const smallTestData = [44.34, 44.09, 44.15, 43.61, 44.33, 44.83, 45.85, 46.08, 45.89, 46.03, 46.83, 47.69, 46.49, 46.26, 47.09];

  test('functional ROC should match reference implementation with real market data', () => {
    const ourResult = roc({ period, values: rocTestData });
    const referenceResult = referenceROC({ period, values: rocTestData });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    expect(ourResult).toHaveLength(rocTestData.length - period);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 4);
    }
  });

  test('functional ROC should work with small test data', () => {
    const ourResult = roc({ period, values: smallTestData });
    const referenceResult = referenceROC({ period, values: smallTestData });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 4);
    }
  });

  test('class-based ROC should work correctly with streaming data', () => {
    const ourROC = new ROC({ period, values: [] });
    const referenceResult = referenceROC({ period, values: rocTestData });
    
    let streamResults: number[] = [];
    
    rocTestData.forEach(value => {
      const result = ourROC.nextValue(value);
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
    expect(roc({ period: 0, values: rocTestData })).toEqual([]);
    expect(roc({ period: rocTestData.length, values: rocTestData })).toEqual([]);
    expect(roc({ period: 5, values: [] })).toEqual([]);
  });
});