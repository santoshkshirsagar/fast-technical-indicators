import { cci, CCI } from '../src/oscillators/cci';
import { cci as referenceCCI } from 'technicalindicators';
import testDataRaw from './data.json';

describe('CCI (Commodity Channel Index)', () => {
  // Use all data points from data.json for testing
  const testDataArray = Array.isArray(testDataRaw) ? testDataRaw : [testDataRaw];
  const cciTestData = {
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

  test('functional CCI should match reference implementation with real market data', () => {
    const ourResult = cci({ 
      period, 
      high: cciTestData.high, 
      low: cciTestData.low, 
      close: cciTestData.close 
    });
    
    const referenceResult = referenceCCI({
      period,
      high: cciTestData.high,
      low: cciTestData.low,
      close: cciTestData.close
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    expect(ourResult).toHaveLength(cciTestData.high.length - period + 1);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 4);
    }
  });

  test('functional CCI should work with small test data', () => {
    const ourResult = cci({ 
      period, 
      high: smallTestData.high, 
      low: smallTestData.low, 
      close: smallTestData.close 
    });
    
    const referenceResult = referenceCCI({
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

  test('class-based CCI should work correctly with streaming data', () => {
    const ourCCI = new CCI({ period, high: [], low: [], close: [] });
    const referenceResult = referenceCCI({
      period,
      high: cciTestData.high,
      low: cciTestData.low,
      close: cciTestData.close
    });
    
    let streamResults: number[] = [];
    
    for (let i = 0; i < cciTestData.high.length; i++) {
      const result = ourCCI.nextValue(cciTestData.high[i], cciTestData.low[i], cciTestData.close[i]);
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
    const emptyResult = cci({ period: 14, high: [], low: [], close: [] });
    expect(emptyResult).toEqual([]);
    
    const shortDataResult = cci({ 
      period: cciTestData.high.length, 
      high: cciTestData.high.slice(0, 1), 
      low: cciTestData.low.slice(0, 1), 
      close: cciTestData.close.slice(0, 1) 
    });
    expect(shortDataResult).toEqual([]);
  });
});