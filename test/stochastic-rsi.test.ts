import { stochasticrsi, StochasticRSI } from '../src/momentum/stochastic-rsi';
import { stochasticrsi as referenceStochRSI } from 'technicalindicators';

describe('Stochastic RSI', () => {
  const testData = {
    values: [44.34, 44.09, 44.15, 43.61, 44.33, 44.83, 45.85, 46.08, 45.89, 46.03, 46.83, 47.69, 46.49, 46.26, 47.09, 47.37, 47.20, 47.12, 46.84, 46.78, 46.57, 46.63, 46.59, 46.99, 47.29],
    rsiPeriod: 14,
    stochasticPeriod: 14,
    kPeriod: 3,
    dPeriod: 3
  };

  test('functional Stochastic RSI should match reference implementation', () => {
    const ourResult = stochasticrsi({ 
      rsiPeriod: testData.rsiPeriod,
      stochasticPeriod: testData.stochasticPeriod,
      kPeriod: testData.kPeriod,
      dPeriod: testData.dPeriod,
      values: testData.values
    });
    
    const referenceResult = referenceStochRSI({
      rsiPeriod: testData.rsiPeriod,
      stochasticPeriod: testData.stochasticPeriod,
      kPeriod: testData.kPeriod,
      dPeriod: testData.dPeriod,
      values: testData.values
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i].k).toBeCloseTo(referenceResult[i].k, 4);
      expect(ourResult[i].d).toBeCloseTo(referenceResult[i].d, 4);
      expect(ourResult[i].stochRSI).toBeCloseTo(referenceResult[i].stochRSI, 4);
    }
  });

  test('class-based Stochastic RSI should work correctly', () => {
    const ourStochRSI = new StochasticRSI({ 
      rsiPeriod: testData.rsiPeriod,
      stochasticPeriod: testData.stochasticPeriod,
      kPeriod: testData.kPeriod,
      dPeriod: testData.dPeriod,
      values: []
    });
    const referenceResult = referenceStochRSI({
      rsiPeriod: testData.rsiPeriod,
      stochasticPeriod: testData.stochasticPeriod,
      kPeriod: testData.kPeriod,
      dPeriod: testData.dPeriod,
      values: testData.values
    });
    
    let streamResults: any[] = [];
    
    for (let i = 0; i < testData.values.length; i++) {
      const result = ourStochRSI.nextValue(testData.values[i]);
      if (result !== undefined) {
        streamResults.push(result);
      }
    }
    
    expect(streamResults).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < streamResults.length; i++) {
      expect(streamResults[i].k).toBeCloseTo(referenceResult[i].k, 4);
      expect(streamResults[i].d).toBeCloseTo(referenceResult[i].d, 4);
      expect(streamResults[i].stochRSI).toBeCloseTo(referenceResult[i].stochRSI, 4);
    }
  });

  test('should handle edge cases', () => {
    const emptyResult = stochasticrsi({ 
      rsiPeriod: 14, 
      stochasticPeriod: 14, 
      kPeriod: 3, 
      dPeriod: 3, 
      values: [] 
    });
    expect(emptyResult).toEqual([]);
    
    const shortDataResult = stochasticrsi({ 
      rsiPeriod: 14, 
      stochasticPeriod: 14, 
      kPeriod: 3, 
      dPeriod: 3, 
      values: [1, 2, 3] 
    });
    expect(shortDataResult).toEqual([]);
  });
});