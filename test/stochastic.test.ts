import { stochastic, Stochastic } from '../src/momentum/stochastic';
import { stochastic as referenceStochastic } from 'technicalindicators';

describe('Stochastic Oscillator', () => {
  const testData = {
    high: [44.34, 44.09, 44.15, 43.61, 44.33, 44.83, 45.85, 46.08, 45.89, 46.03, 46.83, 47.69, 46.49, 46.26, 47.09, 46.66, 46.80],
    low: [44.12, 43.85, 43.99, 43.21, 44.12, 44.38, 45.20, 45.83, 45.48, 45.90, 46.50, 47.11, 46.20, 46.02, 46.78, 46.30, 46.47],
    close: [44.20, 43.91, 44.10, 43.55, 44.29, 44.72, 45.75, 46.00, 45.61, 45.95, 46.71, 47.47, 46.35, 46.20, 47.01, 46.55, 46.75]
  };
  
  const period = 14;
  const signalPeriod = 3;

  test('functional Stochastic should match reference implementation', () => {
    const ourResult = stochastic({ 
      period, 
      signalPeriod,
      high: testData.high, 
      low: testData.low, 
      close: testData.close 
    });
    
    const referenceResult = referenceStochastic({
      period,
      signalPeriod, 
      high: testData.high,
      low: testData.low,
      close: testData.close
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < Math.min(ourResult.length, referenceResult.length); i++) {
      if (ourResult[i].k !== undefined && referenceResult[i].k !== undefined) {
        expect(ourResult[i].k!).toBeCloseTo(referenceResult[i].k!, 1);
      }
      
      if (ourResult[i].d !== undefined && referenceResult[i].d !== undefined) {
        expect(ourResult[i].d!).toBeCloseTo(referenceResult[i].d!, 1);
      }
    }
  });

  test('class-based Stochastic should work correctly', () => {
    const ourStochastic = new Stochastic({ period, signalPeriod, high: [], low: [], close: [] });
    let streamResults: any[] = [];
    
    for (let i = 0; i < testData.high.length; i++) {
      const result = ourStochastic.nextValue(testData.high[i], testData.low[i], testData.close[i]);
      if (result !== undefined) {
        streamResults.push(result);
      }
    }
    
    expect(streamResults.length).toBeGreaterThan(0);
    
    // Check that K values are within expected range (0-100)
    streamResults.forEach(result => {
      expect(result.k).toBeGreaterThanOrEqual(0);
      expect(result.k).toBeLessThanOrEqual(100);
    });
  });

  test('should handle edge cases', () => {
    const emptyResult = stochastic({ period: 14, high: [], low: [], close: [] });
    expect(emptyResult).toEqual([]);
    
    const shortDataResult = stochastic({ 
      period: 14, 
      high: [1, 2], 
      low: [1, 2], 
      close: [1, 2] 
    });
    expect(shortDataResult).toEqual([]);
  });
});