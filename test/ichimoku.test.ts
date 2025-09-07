import { ichimokukinkouhyou, IchimokuKinkouhyou, ichimokucloud, IchimokuCloud } from '../src/trend/ichimoku';
import { ichimokucloud as referenceIchimoku } from 'technicalindicators';
import testDataRaw from './data.json';

describe('Ichimoku (Ichimoku Kinko Hyo)', () => {
  // Use all data points from data.json for testing
  const testDataArray = Array.isArray(testDataRaw) ? testDataRaw : [testDataRaw];
  const testData = {
    high: testDataArray.map(d => d.high),
    low: testDataArray.map(d => d.low)
  };

  // Use first 60 data points from the test data for sufficient Ichimoku calculation
  const smallTestData = {
    high: testData.high.slice(0, 60),
    low: testData.low.slice(0, 60)
  };

  // Default Ichimoku parameters
  const defaultParams = {
    conversionPeriod: 9,
    basePeriod: 26, 
    spanPeriod: 52,
    displacement: 26
  };

  test('functional ichimokukinkouhyou should match reference implementation with real market data', () => {
    const ourResult = ichimokukinkouhyou({ 
      high: testData.high, 
      low: testData.low,
      ...defaultParams
    });
    const referenceResult = referenceIchimoku({ 
      high: testData.high, 
      low: testData.low,
      ...defaultParams  
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      if (ourResult[i].conversion !== undefined && referenceResult[i].conversion !== undefined) {
        expect(ourResult[i].conversion).toBeCloseTo(referenceResult[i].conversion!, 2);
      }
      if (ourResult[i].base !== undefined && referenceResult[i].base !== undefined) {
        expect(ourResult[i].base).toBeCloseTo(referenceResult[i].base!, 2);
      }
      if (ourResult[i].spanA !== undefined && referenceResult[i].spanA !== undefined) {
        expect(ourResult[i].spanA).toBeCloseTo(referenceResult[i].spanA!, 2);
      }
      if (ourResult[i].spanB !== undefined && referenceResult[i].spanB !== undefined) {
        expect(ourResult[i].spanB).toBeCloseTo(referenceResult[i].spanB!, 2);
      }
    }
  });

  test('functional ichimokukinkouhyou should work with small test data', () => {
    const ourResult = ichimokukinkouhyou({ 
      high: smallTestData.high, 
      low: smallTestData.low,
      ...defaultParams
    });
    const referenceResult = referenceIchimoku({ 
      high: smallTestData.high, 
      low: smallTestData.low,
      ...defaultParams
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      if (ourResult[i].conversion !== undefined && referenceResult[i].conversion !== undefined) {
        expect(ourResult[i].conversion).toBeCloseTo(referenceResult[i].conversion!, 1);
      }
      if (ourResult[i].base !== undefined && referenceResult[i].base !== undefined) {
        expect(ourResult[i].base).toBeCloseTo(referenceResult[i].base!, 1);
      }
    }
  });

  test('class-based IchimokuKinkouhyou should work correctly with streaming data', () => {
    const ourIchimoku = new IchimokuKinkouhyou({ 
      high: [], 
      low: [],
      ...defaultParams
    });
    const referenceResult = referenceIchimoku({ 
      high: smallTestData.high, 
      low: smallTestData.low,
      ...defaultParams
    });
    
    let streamResults: any[] = [];
    
    for (let i = 0; i < smallTestData.high.length; i++) {
      const result = ourIchimoku.nextValue(smallTestData.high[i], smallTestData.low[i]);
      if (result !== undefined) {
        streamResults.push(result);
      }
    }
    
    expect(streamResults).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < streamResults.length; i++) {
      if (streamResults[i]?.conversion !== undefined && referenceResult[i].conversion !== undefined) {
        expect(streamResults[i].conversion).toBeCloseTo(referenceResult[i].conversion!, 1);
      }
      if (streamResults[i]?.base !== undefined && referenceResult[i].base !== undefined) {
        expect(streamResults[i].base).toBeCloseTo(referenceResult[i].base!, 1);
      }
    }
  });

  test('ichimokucloud alias should work the same as ichimokukinkouhyou', () => {
    const originalResult = ichimokukinkouhyou({ 
      high: smallTestData.high, 
      low: smallTestData.low,
      ...defaultParams
    });
    const aliasResult = ichimokucloud({ 
      high: smallTestData.high, 
      low: smallTestData.low,
      ...defaultParams
    });
    
    expect(aliasResult).toHaveLength(originalResult.length);
    
    for (let i = 0; i < originalResult.length; i++) {
      expect(aliasResult[i]).toEqual(originalResult[i]);
    }
  });

  test('IchimokuCloud class should work the same as IchimokuKinkouhyou class', () => {
    const originalIchimoku = new IchimokuKinkouhyou({ 
      high: smallTestData.high, 
      low: smallTestData.low,
      ...defaultParams
    });
    const aliasIchimoku = new IchimokuCloud({ 
      high: smallTestData.high, 
      low: smallTestData.low,
      ...defaultParams
    });
    
    const originalResult = originalIchimoku.getResult();
    const aliasResult = aliasIchimoku.getResult();
    
    expect(aliasResult).toHaveLength(originalResult.length);
    
    for (let i = 0; i < originalResult.length; i++) {
      expect(aliasResult[i]).toEqual(originalResult[i]);
    }
  });

  test('should handle edge cases', () => {
    expect(ichimokukinkouhyou({ high: [], low: [] })).toEqual([]);
    expect(ichimokukinkouhyou({ high: [100], low: [] })).toEqual([]);
    expect(ichimokukinkouhyou({ high: [], low: [90] })).toEqual([]);
    expect(ichimokukinkouhyou({ high: [100, 101], low: [90, 91, 92] })).toEqual([]);
  });

  test('should work with custom parameters', () => {
    const customParams = {
      conversionPeriod: 7,
      basePeriod: 22,
      spanPeriod: 44,
      displacement: 22
    };
    
    const ourResult = ichimokukinkouhyou({ 
      high: smallTestData.high, 
      low: smallTestData.low,
      ...customParams
    });
    const referenceResult = referenceIchimoku({ 
      high: smallTestData.high, 
      low: smallTestData.low,
      ...customParams
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < Math.min(ourResult.length, 5); i++) {
      if (ourResult[i].conversion !== undefined && referenceResult[i].conversion !== undefined) {
        expect(ourResult[i].conversion).toBeCloseTo(referenceResult[i].conversion!, 1);
      }
    }
  });
});