import { trix, TRIX } from '../src/momentum/trix';
import { trix as referenceTRIX } from 'technicalindicators';

describe('TRIX', () => {
  const testData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
  const period = 14;

  test('functional TRIX should match reference implementation', () => {
    const ourResult = trix({ period, values: testData });
    const referenceResult = referenceTRIX({ period, values: testData });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 4);
    }
  });

  test('class-based TRIX should work correctly', () => {
    const ourTRIX = new TRIX({ period, values: [] });
    const referenceResult = referenceTRIX({ period, values: testData });
    
    let streamResults: number[] = [];
    
    for (let i = 0; i < testData.length; i++) {
      const result = ourTRIX.nextValue(testData[i]);
      if (result !== undefined) {
        streamResults.push(result);
      }
    }
    
    expect(streamResults).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < streamResults.length; i++) {
      expect(streamResults[i]).toBeCloseTo(referenceResult[i], 4);
    }
  });

  test('should handle edge cases', () => {
    const emptyResult = trix({ period: 14, values: [] });
    expect(emptyResult).toEqual([]);
    
    const shortDataResult = trix({ period: 14, values: [1, 2, 3] });
    expect(shortDataResult).toEqual([]);
  });
});