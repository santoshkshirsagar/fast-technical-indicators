import { williamsr, WilliamsR } from '../src/momentum/williams-r';
import { williamsr as referenceWR } from 'technicalindicators';
import testDataRaw from './data.json';

describe('Williams %R', () => {
  // Use all data points from data.json for testing
  const testDataArray = Array.isArray(testDataRaw) ? testDataRaw : [testDataRaw];
  const williamsTestData = {
    high: testDataArray.map(d => d.high),
    low: testDataArray.map(d => d.low),
    close: testDataArray.map(d => d.close)
  };
  const period = 14;

  const smallTestData = {
    high: [127.01, 127.62, 126.59, 127.35, 128.17, 128.43, 127.37, 126.42, 126.90, 126.85, 125.65, 125.72, 127.16, 127.72, 127.69],
    low: [125.36, 126.16, 124.93, 126.09, 126.82, 126.48, 125.81, 124.83, 126.39, 125.72, 124.56, 124.57, 125.07, 126.86, 126.63],
    close: [125.85, 126.48, 125.01, 127.02, 127.32, 127.11, 126.80, 126.13, 126.53, 125.81, 125.13, 125.46, 125.58, 127.49, 127.23]
  };

  test('functional Williams %R should match reference implementation with real market data', () => {
    const ourResult = williamsr({ 
      period, 
      high: williamsTestData.high, 
      low: williamsTestData.low, 
      close: williamsTestData.close 
    });
    
    const referenceResult = referenceWR({
      period,
      high: williamsTestData.high,
      low: williamsTestData.low,
      close: williamsTestData.close
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    expect(ourResult).toHaveLength(williamsTestData.high.length - period + 1);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 4);
    }
  });

  test('functional Williams %R should work with small test data', () => {
    const ourResult = williamsr({ 
      period, 
      high: smallTestData.high, 
      low: smallTestData.low, 
      close: smallTestData.close 
    });
    
    const referenceResult = referenceWR({
      period,
      high: smallTestData.high,
      low: smallTestData.low,
      close: smallTestData.close
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 4);
    }
  });

  test('class-based Williams %R should work correctly with streaming data', () => {
    const ourWR = new WilliamsR({ period, high: [], low: [], close: [] });
    const referenceResult = referenceWR({
      period,
      high: williamsTestData.high,
      low: williamsTestData.low,
      close: williamsTestData.close
    });
    
    let streamResults: number[] = [];
    
    for (let i = 0; i < williamsTestData.high.length; i++) {
      const result = ourWR.nextValue(williamsTestData.high[i], williamsTestData.low[i], williamsTestData.close[i]);
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
    const emptyResult = williamsr({ period: 14, high: [], low: [], close: [] });
    expect(emptyResult).toEqual([]);
    
    const shortDataResult = williamsr({ 
      period: williamsTestData.high.length, 
      high: williamsTestData.high.slice(0, 1), 
      low: williamsTestData.low.slice(0, 1), 
      close: williamsTestData.close.slice(0, 1) 
    });
    expect(shortDataResult).toEqual([]);
  });
});