import { adx, ADX, ADXOutput } from '../src/directional-movement/adx';
import { adx as referenceADX } from 'technicalindicators';
import testDataRaw from './data.json';

describe('ADX (Average Directional Index)', () => {
  // Use all data points from data.json for testing
  const testDataArray = Array.isArray(testDataRaw) ? testDataRaw : [testDataRaw];
  const adxTestData = {
    high: testDataArray.map(d => d.high),
    low: testDataArray.map(d => d.low),
    close: testDataArray.map(d => d.close)
  };
  
  const period = 14;

  const smallTestData = {
    high: [48.70, 48.72, 48.90, 48.87, 48.82, 49.05, 49.20, 49.35, 49.92, 50.19, 50.12, 49.66, 49.88, 50.19, 50.36, 50.57, 50.65, 50.43, 49.63, 49.88, 50.19, 50.36, 50.57, 50.65, 50.43, 49.63, 49.88, 50.19, 50.36],
    low: [47.79, 48.14, 48.39, 48.37, 48.24, 48.64, 48.94, 48.86, 49.50, 49.87, 49.20, 48.90, 49.43, 49.73, 49.26, 50.09, 50.30, 49.21, 48.98, 49.50, 49.87, 49.20, 50.09, 50.30, 49.21, 48.98, 49.50, 49.87, 49.20],
    close: [48.16, 48.61, 48.75, 48.63, 48.74, 49.03, 49.07, 49.32, 49.91, 50.13, 49.53, 49.50, 49.75, 50.03, 50.31, 50.52, 50.41, 49.34, 49.37, 49.68, 50.13, 49.53, 50.52, 50.41, 49.34, 49.37, 49.68, 50.13, 49.53]
  };

  test('functional ADX should match reference implementation with real market data', () => {
    const ourResult = adx({ 
      period, 
      high: adxTestData.high, 
      low: adxTestData.low, 
      close: adxTestData.close 
    });
    
    const referenceResult = referenceADX({
      period,
      high: adxTestData.high,
      low: adxTestData.low,
      close: adxTestData.close
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i].adx).toBeCloseTo(referenceResult[i].adx, 4);
      expect(ourResult[i].pdi).toBeCloseTo(referenceResult[i].pdi, 4);
      expect(ourResult[i].mdi).toBeCloseTo(referenceResult[i].mdi, 4);
    }
  });

  test('functional ADX should work with small test data', () => {
    const ourResult = adx({ 
      period, 
      high: smallTestData.high, 
      low: smallTestData.low, 
      close: smallTestData.close 
    });
    
    // ADX should return array of ADXOutput objects
    expect(Array.isArray(ourResult)).toBe(true);
    
    if (ourResult.length > 0) {
      // ADX values should be between 0 and 100 and have proper structure
      ourResult.forEach(value => {
        expect(typeof value).toBe('object');
        expect(value).toHaveProperty('adx');
        expect(value).toHaveProperty('pdi');
        expect(value).toHaveProperty('mdi');
        if (value.adx !== undefined) {
          expect(value.adx).toBeGreaterThanOrEqual(0);
          expect(value.adx).toBeLessThanOrEqual(100);
        }
        if (value.pdi !== undefined) {
          expect(value.pdi).toBeGreaterThanOrEqual(0);
        }
        if (value.mdi !== undefined) {
          expect(value.mdi).toBeGreaterThanOrEqual(0);
        }
      });
    }
  });

  test('class-based ADX should work correctly with streaming data', () => {
    const ourADX = new ADX({ period, high: [], low: [], close: [] });
    const referenceResult = referenceADX({
      period,
      high: adxTestData.high,
      low: adxTestData.low,
      close: adxTestData.close
    });
    
    let streamResults: ADXOutput[] = [];
    
    for (let i = 0; i < adxTestData.high.length; i++) {
      const result = ourADX.nextValue(adxTestData.high[i], adxTestData.low[i], adxTestData.close[i]);
      if (result !== undefined) {
        streamResults.push(result);
      }
    }
    
    expect(streamResults).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < streamResults.length; i++) {
      expect(streamResults[i].adx).toBeCloseTo(referenceResult[i].adx, 4);
      expect(streamResults[i].pdi).toBeCloseTo(referenceResult[i].pdi, 4);
      expect(streamResults[i].mdi).toBeCloseTo(referenceResult[i].mdi, 4);
    }
  });

  test('should handle edge cases', () => {
    const emptyResult = adx({ period: 14, high: [], low: [], close: [] });
    expect(emptyResult).toEqual([]);
    
    const shortDataResult = adx({ 
      period: adxTestData.high.length, 
      high: adxTestData.high.slice(0, 1), 
      low: adxTestData.low.slice(0, 1), 
      close: adxTestData.close.slice(0, 1) 
    });
    expect(shortDataResult).toEqual([]);
  });

  test('should work with different smoothing period', () => {
    const regularResult = adx({ 
      period: 14,
      high: smallTestData.high, 
      low: smallTestData.low, 
      close: smallTestData.close 
    });
    
    const differentSmoothingResult = adx({ 
      period: 14,
      smoothingPeriod: 10,
      high: smallTestData.high, 
      low: smallTestData.low, 
      close: smallTestData.close 
    });
    
    // Should have results
    expect(regularResult.length).toBeGreaterThan(0);
    expect(differentSmoothingResult.length).toBeGreaterThan(0);
    
    // Results should be different due to different smoothing
    if (regularResult.length > 0 && differentSmoothingResult.length > 0) {
      const lastRegular = regularResult[regularResult.length - 1];
      const lastDifferent = differentSmoothingResult[differentSmoothingResult.length - 1];
      
      // ADX values should be different
      expect(lastRegular.adx).not.toBeCloseTo(lastDifferent.adx!, 2);
      
      // PDI and MDI should be the same (only ADX smoothing changes)
      expect(lastRegular.pdi).toBeCloseTo(lastDifferent.pdi!, 4);
      expect(lastRegular.mdi).toBeCloseTo(lastDifferent.mdi!, 4);
    }
  });
});