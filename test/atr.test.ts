import { atr, ATR } from '../src/volatility/atr';
import { atr as referenceATR } from 'technicalindicators';
import testDataRaw from './data.json';

describe('ATR (Average True Range)', () => {
  // Use all data points from data.json for testing
  const testDataArray = Array.isArray(testDataRaw) ? testDataRaw : [testDataRaw];
  const testData = {
    high: testDataArray.map(d => d.high),
    low: testDataArray.map(d => d.low),
    close: testDataArray.map(d => d.close)
  };
  
  const period = 14;

  const smallTestData = {
    high: [48.70, 48.72, 48.90, 48.87, 48.82, 49.05, 49.20, 49.35, 49.92, 50.19, 50.12, 49.66, 49.88, 50.19, 50.36],
    low: [47.79, 48.14, 48.39, 48.37, 48.24, 48.64, 48.94, 48.86, 49.50, 49.87, 49.20, 48.90, 49.43, 49.73, 49.26],
    close: [48.16, 48.61, 48.75, 48.63, 48.74, 49.03, 49.07, 49.32, 49.91, 50.13, 49.53, 49.50, 49.75, 50.03, 50.31]
  };

  test('functional ATR should match reference implementation with real market data', () => {
    const ourResult = atr({ 
      period, 
      high: testData.high, 
      low: testData.low, 
      close: testData.close 
    });
    
    const referenceResult = referenceATR({
      period,
      high: testData.high,
      low: testData.low,
      close: testData.close
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 4);
    }
  });

  test('functional ATR should work with small test data', () => {
    const ourResult = atr({ 
      period, 
      high: smallTestData.high, 
      low: smallTestData.low, 
      close: smallTestData.close 
    });
    
    const referenceResult = referenceATR({
      period,
      high: smallTestData.high,
      low: smallTestData.low,
      close: smallTestData.close
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 2);
    }
  });

  test('class-based ATR should work correctly with streaming data', () => {
    const ourATR = new ATR({ period, high: [], low: [], close: [] });
    const referenceResult = referenceATR({
      period,
      high: testData.high,
      low: testData.low,
      close: testData.close
    });
    
    let streamResults: number[] = [];
    
    for (let i = 0; i < testData.high.length; i++) {
      const result = ourATR.nextValue(testData.high[i], testData.low[i], testData.close[i]);
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
    const emptyResult = atr({ period: 14, high: [], low: [], close: [] });
    expect(emptyResult).toEqual([]);
    
    const shortDataResult = atr({ 
      period: 14, 
      high: [1], 
      low: [1], 
      close: [1] 
    });
    expect(shortDataResult).toEqual([]);
  });
});