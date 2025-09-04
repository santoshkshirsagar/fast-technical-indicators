import { vwap, VWAP } from '../src/volume/vwap';
import { vwap as referenceVWAP } from 'technicalindicators';
import testDataRaw from './data.json';

describe('VWAP (Volume Weighted Average Price)', () => {
  // Use all data points from data.json for testing
  const testDataArray = Array.isArray(testDataRaw) ? testDataRaw : [testDataRaw];
  const vwapTestData = {
    high: testDataArray.map(d => d.high),
    low: testDataArray.map(d => d.low),
    close: testDataArray.map(d => d.close),
    volume: testDataArray.map(d => d.volume)
  };

  const smallTestData = {
    high: [127.01, 127.62, 126.59, 127.35, 128.17],
    low: [125.36, 126.16, 124.93, 126.09, 126.82],
    close: [125.85, 126.48, 125.01, 127.02, 127.32],
    volume: [25200, 30000, 25600, 32000, 23000]
  };

  test('functional VWAP should match reference implementation with real market data', () => {
    const ourResult = vwap(vwapTestData);
    const referenceResult = referenceVWAP(vwapTestData);
    
    expect(ourResult).toHaveLength(referenceResult.length);
    expect(ourResult).toHaveLength(testDataArray.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 4);
    }
  });

  test('functional VWAP should work with small test data', () => {
    const ourResult = vwap(smallTestData);
    const referenceResult = referenceVWAP(smallTestData);
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 4);
    }
  });

  test('class-based VWAP should work correctly with streaming data', () => {
    const ourVWAP = new VWAP();
    const referenceResult = referenceVWAP(vwapTestData);
    
    let streamResults: number[] = [];
    
    for (let i = 0; i < vwapTestData.high.length; i++) {
      const result = ourVWAP.nextValue(vwapTestData.high[i], vwapTestData.low[i], vwapTestData.close[i], vwapTestData.volume[i]);
      streamResults.push(result);
    }
    
    expect(streamResults).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < streamResults.length; i++) {
      expect(streamResults[i]).toBeCloseTo(referenceResult[i], 4);
    }
  });

  test('should handle edge cases', () => {
    const emptyResult = vwap({ high: [], low: [], close: [], volume: [] });
    expect(emptyResult).toEqual([]);
    
    const mismatchedLengthResult = vwap({ 
      high: [1], 
      low: [1], 
      close: [1], 
      volume: [100, 200] 
    });
    expect(mismatchedLengthResult).toEqual([]);
  });
});