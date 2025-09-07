import { stochastic, Stochastic } from '../src/momentum/stochastic';
import { stochastic as referenceStochastic } from 'technicalindicators';
import testDataRaw from './data.json';

describe('Stochastic Oscillator', () => {
  // Use all data points from data.json for testing
  const testDataArray = Array.isArray(testDataRaw) ? testDataRaw : [testDataRaw];
  const stochasticTestData = {
    high: testDataArray.map(d => d.high),
    low: testDataArray.map(d => d.low),
    close: testDataArray.map(d => d.close)
  };
  
  const period = 14;
  const signalPeriod = 3;

  const smallTestData = {
    high: [44.34, 44.09, 44.15, 43.61, 44.33, 44.83, 45.85, 46.08, 45.89, 46.03, 46.83, 47.69, 46.49, 46.26, 47.09, 46.66, 46.80],
    low: [44.12, 43.85, 43.99, 43.21, 44.12, 44.38, 45.20, 45.83, 45.48, 45.90, 46.50, 47.11, 46.20, 46.02, 46.78, 46.30, 46.47],
    close: [44.20, 43.91, 44.10, 43.55, 44.29, 44.72, 45.75, 46.00, 45.61, 45.95, 46.71, 47.47, 46.35, 46.20, 47.01, 46.55, 46.75]
  };

  test('functional Stochastic should match reference implementation with real market data', () => {
    const ourResult = stochastic({ 
      period, 
      signalPeriod,
      high: stochasticTestData.high, 
      low: stochasticTestData.low, 
      close: stochasticTestData.close 
    });
    
    const referenceResult = referenceStochastic({
      period,
      signalPeriod, 
      high: stochasticTestData.high,
      low: stochasticTestData.low,
      close: stochasticTestData.close
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < Math.min(ourResult.length, referenceResult.length); i++) {
      if (ourResult[i].k !== undefined && referenceResult[i].k !== undefined) {
        expect(ourResult[i].k!).toBeCloseTo(referenceResult[i].k!, 4);
      }
      
      if (ourResult[i].d !== undefined && referenceResult[i].d !== undefined) {
        expect(ourResult[i].d!).toBeCloseTo(referenceResult[i].d!, 4);
      }
    }
  });

  test('functional Stochastic should work with small test data', () => {
    const ourResult = stochastic({ 
      period, 
      signalPeriod,
      high: smallTestData.high, 
      low: smallTestData.low, 
      close: smallTestData.close 
    });
    
    const referenceResult = referenceStochastic({
      period,
      signalPeriod, 
      high: smallTestData.high,
      low: smallTestData.low,
      close: smallTestData.close
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < Math.min(ourResult.length, referenceResult.length); i++) {
      if (ourResult[i].k !== undefined && referenceResult[i].k !== undefined) {
        expect(ourResult[i].k!).toBeCloseTo(referenceResult[i].k!, 4);
      }
      
      if (ourResult[i].d !== undefined && referenceResult[i].d !== undefined) {
        expect(ourResult[i].d!).toBeCloseTo(referenceResult[i].d!, 4);
      }
    }
  });

  test('class-based Stochastic should work correctly with streaming data', () => {
    const ourStochastic = new Stochastic({ period, signalPeriod, high: [], low: [], close: [] });
    const referenceResult = referenceStochastic({
      period,
      signalPeriod, 
      high: stochasticTestData.high,
      low: stochasticTestData.low,
      close: stochasticTestData.close
    });
    
    let streamResults: any[] = [];
    
    for (let i = 0; i < stochasticTestData.high.length; i++) {
      const result = ourStochastic.nextValue(stochasticTestData.high[i], stochasticTestData.low[i], stochasticTestData.close[i]);
      if (result !== undefined) {
        streamResults.push(result);
      }
    }
    
    expect(streamResults).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < Math.min(streamResults.length, referenceResult.length); i++) {
      if (streamResults[i].k !== undefined && referenceResult[i].k !== undefined) {
        expect(streamResults[i].k!).toBeCloseTo(referenceResult[i].k!, 4);
      }
      
      if (streamResults[i].d !== undefined && referenceResult[i].d !== undefined) {
        expect(streamResults[i].d!).toBeCloseTo(referenceResult[i].d!, 4);
      }
    }
  });

  test('should handle edge cases', () => {
    const emptyResult = stochastic({ period: 14, high: [], low: [], close: [] });
    expect(emptyResult).toEqual([]);
    
    const shortDataResult = stochastic({ 
      period: stochasticTestData.high.length, 
      high: stochasticTestData.high.slice(0, 2), 
      low: stochasticTestData.low.slice(0, 2), 
      close: stochasticTestData.close.slice(0, 2) 
    });
    expect(shortDataResult).toEqual([]);
  });
});