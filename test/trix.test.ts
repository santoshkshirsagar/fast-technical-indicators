import { trix, TRIX } from '../src/momentum/trix';
import { trix as referenceTRIX } from 'technicalindicators';
import testDataRaw from './data.json';

describe('TRIX', () => {
  // Use all data points from data.json for testing
  const testDataArray = Array.isArray(testDataRaw) ? testDataRaw : [testDataRaw];
  const trixTestData = testDataArray.map(d => d.close);
  const period = 14;

  const smallTestData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

  test('functional TRIX should match reference implementation with real market data', () => {
    const ourResult = trix({ period, values: trixTestData });
    const referenceResult = referenceTRIX({ period, values: trixTestData });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 4);
    }
  });

  test('functional TRIX should work with small test data', () => {
    const ourResult = trix({ period, values: smallTestData });
    const referenceResult = referenceTRIX({ period, values: smallTestData });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 4);
    }
  });

  test('class-based TRIX should work correctly with streaming data', () => {
    const ourTRIX = new TRIX({ period, values: [] });
    const referenceResult = referenceTRIX({ period, values: trixTestData });
    
    let streamResults: number[] = [];
    
    for (let i = 0; i < trixTestData.length; i++) {
      const result = ourTRIX.nextValue(trixTestData[i]);
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
    
    const shortDataResult = trix({ period: trixTestData.length, values: trixTestData.slice(0, 3) });
    expect(shortDataResult).toEqual([]);
  });
});