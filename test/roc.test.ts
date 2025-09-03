import { roc, ROC } from '../src/momentum/roc';
import { roc as referenceROC } from 'technicalindicators';

describe('ROC (Rate of Change)', () => {
  const testData = [44.34, 44.09, 44.15, 43.61, 44.33, 44.83, 45.85, 46.08, 45.89, 46.03, 46.83, 47.69, 46.49, 46.26, 47.09];
  const period = 10;

  test('functional ROC should match reference implementation', () => {
    const ourResult = roc({ period, values: testData });
    const referenceResult = referenceROC({ period, values: testData });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 2);
    }
  });

  test('class-based ROC should work correctly', () => {
    const ourROC = new ROC({ period, values: [] });
    const referenceResult = referenceROC({ period, values: testData });
    
    let streamResults: number[] = [];
    
    testData.forEach(value => {
      const result = ourROC.nextValue(value);
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
    expect(roc({ period: 0, values: testData })).toEqual([]);
    expect(roc({ period: testData.length, values: testData })).toEqual([]);
    expect(roc({ period: 5, values: [] })).toEqual([]);
  });
});