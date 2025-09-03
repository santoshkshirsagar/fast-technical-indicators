import { bollingerbands, BollingerBands } from '../src/volatility/bollinger-bands';
import { bollingerbands as referenceBB } from 'technicalindicators';

describe('Bollinger Bands', () => {
  const testData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const period = 10;
  const stdDev = 2;

  test('functional Bollinger Bands should match reference implementation', () => {
    const ourResult = bollingerbands({ 
      period, 
      stdDev, 
      values: testData 
    });
    
    const referenceResult = referenceBB({
      period,
      stdDev,
      values: testData
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i].upper).toBeCloseTo(referenceResult[i].upper, 5);
      expect(ourResult[i].middle).toBeCloseTo(referenceResult[i].middle, 5);
      expect(ourResult[i].lower).toBeCloseTo(referenceResult[i].lower, 5);
      expect(ourResult[i].pb).toBeCloseTo(referenceResult[i].pb, 5);
    }
  });

  test('class-based Bollinger Bands should work correctly', () => {
    const ourBB = new BollingerBands({ period, stdDev, values: [] });
    const referenceResult = referenceBB({
      period,
      stdDev,
      values: testData
    });
    
    let streamResults: any[] = [];
    
    for (let i = 0; i < testData.length; i++) {
      const result = ourBB.nextValue(testData[i]);
      if (result !== undefined) {
        streamResults.push(result);
      }
    }
    
    expect(streamResults).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < streamResults.length; i++) {
      expect(streamResults[i].upper).toBeCloseTo(referenceResult[i].upper, 5);
      expect(streamResults[i].middle).toBeCloseTo(referenceResult[i].middle, 5);
      expect(streamResults[i].lower).toBeCloseTo(referenceResult[i].lower, 5);
      expect(streamResults[i].pb).toBeCloseTo(referenceResult[i].pb, 5);
    }
  });

  test('should handle edge cases', () => {
    const emptyResult = bollingerbands({ period: 10, stdDev: 2, values: [] });
    expect(emptyResult).toEqual([]);
    
    const shortDataResult = bollingerbands({ 
      period: 20, 
      stdDev: 2, 
      values: [1, 2, 3] 
    });
    expect(shortDataResult).toEqual([]);
  });
});