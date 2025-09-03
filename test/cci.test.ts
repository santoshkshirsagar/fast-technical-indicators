import { cci, CCI } from '../src/oscillators/cci';
import { cci as referenceCCI } from 'technicalindicators';

describe('CCI (Commodity Channel Index)', () => {
  const testData = {
    high: [127.01, 127.62, 126.59, 127.35, 128.17, 128.43, 127.37, 126.42, 126.90, 126.85, 125.65, 125.72, 127.16, 127.72, 127.69],
    low: [125.36, 126.16, 124.93, 126.09, 126.82, 126.48, 125.81, 124.83, 126.39, 125.72, 124.56, 124.57, 125.07, 126.86, 126.63],
    close: [125.85, 126.48, 125.01, 127.02, 127.32, 127.11, 126.80, 126.13, 126.53, 125.81, 125.13, 125.46, 125.58, 127.49, 127.23]
  };
  const period = 14;

  test('functional CCI should match reference implementation', () => {
    const ourResult = cci({ 
      period, 
      high: testData.high, 
      low: testData.low, 
      close: testData.close 
    });
    
    const referenceResult = referenceCCI({
      period,
      high: testData.high,
      low: testData.low,
      close: testData.close
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 2);
    }
  });

  test('class-based CCI should work correctly', () => {
    const ourCCI = new CCI({ period, high: [], low: [], close: [] });
    const referenceResult = referenceCCI({
      period,
      high: testData.high,
      low: testData.low,
      close: testData.close
    });
    
    let streamResults: number[] = [];
    
    for (let i = 0; i < testData.high.length; i++) {
      const result = ourCCI.nextValue(testData.high[i], testData.low[i], testData.close[i]);
      if (result !== undefined) {
        streamResults.push(result);
      }
    }
    
    expect(streamResults).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < streamResults.length; i++) {
      expect(streamResults[i]).toBeCloseTo(referenceResult[i], 2);
    }
  });

  test('should handle edge cases', () => {
    const emptyResult = cci({ period: 14, high: [], low: [], close: [] });
    expect(emptyResult).toEqual([]);
    
    const shortDataResult = cci({ 
      period: 14, 
      high: [1], 
      low: [1], 
      close: [1] 
    });
    expect(shortDataResult).toEqual([]);
  });
});