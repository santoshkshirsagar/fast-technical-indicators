import { bollingerbands, BollingerBands } from '../src/volatility/bollinger-bands';
import { bollingerbands as referenceBB } from 'technicalindicators';
import testDataRaw from './data.json';

describe('Bollinger Bands', () => {
  // Use all data points from data.json for testing
  const testDataArray = Array.isArray(testDataRaw) ? testDataRaw : [testDataRaw];
  const bbTestData = testDataArray.map(d => d.close);
  const period = 10;
  const stdDev = 2;

  const smallTestData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  test('functional Bollinger Bands should match reference implementation with real market data', () => {
    const ourResult = bollingerbands({ 
      period, 
      stdDev, 
      values: bbTestData 
    });
    
    const referenceResult = referenceBB({
      period,
      stdDev,
      values: bbTestData
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    expect(ourResult).toHaveLength(bbTestData.length - period + 1);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i].upper).toBeCloseTo(referenceResult[i].upper, 4);
      expect(ourResult[i].middle).toBeCloseTo(referenceResult[i].middle, 4);
      expect(ourResult[i].lower).toBeCloseTo(referenceResult[i].lower, 4);
      expect(ourResult[i].pb).toBeCloseTo(referenceResult[i].pb, 4);
    }
  });

  test('functional Bollinger Bands should work with small test data', () => {
    const ourResult = bollingerbands({ 
      period, 
      stdDev, 
      values: smallTestData 
    });
    
    const referenceResult = referenceBB({
      period,
      stdDev,
      values: smallTestData
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i].upper).toBeCloseTo(referenceResult[i].upper, 4);
      expect(ourResult[i].middle).toBeCloseTo(referenceResult[i].middle, 4);
      expect(ourResult[i].lower).toBeCloseTo(referenceResult[i].lower, 4);
      expect(ourResult[i].pb).toBeCloseTo(referenceResult[i].pb, 4);
    }
  });

  test('class-based Bollinger Bands should work correctly with streaming data', () => {
    const ourBB = new BollingerBands({ period, stdDev, values: [] });
    const referenceResult = referenceBB({
      period,
      stdDev,
      values: bbTestData
    });
    
    let streamResults: any[] = [];
    
    for (let i = 0; i < bbTestData.length; i++) {
      const result = ourBB.nextValue(bbTestData[i]);
      if (result !== undefined) {
        streamResults.push(result);
      }
    }
    
    expect(streamResults).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < streamResults.length; i++) {
      expect(streamResults[i].upper).toBeCloseTo(referenceResult[i].upper, 4);
      expect(streamResults[i].middle).toBeCloseTo(referenceResult[i].middle, 4);
      expect(streamResults[i].lower).toBeCloseTo(referenceResult[i].lower, 4);
      expect(streamResults[i].pb).toBeCloseTo(referenceResult[i].pb, 4);
    }
  });

  test('should handle edge cases', () => {
    const emptyResult = bollingerbands({ period: 10, stdDev: 2, values: [] });
    expect(emptyResult).toEqual([]);
    
    const shortDataResult = bollingerbands({ 
      period: bbTestData.length, 
      stdDev: 2, 
      values: bbTestData.slice(0, 3) 
    });
    expect(shortDataResult).toEqual([]);
  });
});