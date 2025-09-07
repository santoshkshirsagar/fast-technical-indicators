import { awesomeoscillator, AwesomeOscillator } from '../src/oscillators/awesome-oscillator';
import { awesomeoscillator as referenceAO } from 'technicalindicators';
import testDataRaw from './data.json';

describe('Awesome Oscillator', () => {
  // Use all data points from data.json for testing
  const testDataArray = Array.isArray(testDataRaw) ? testDataRaw : [testDataRaw];
  const aoTestData = {
    high: testDataArray.map(d => d.high),
    low: testDataArray.map(d => d.low),
    fastPeriod: 5,
    slowPeriod: 34
  };

  const smallTestData = {
    high: [127.01, 127.62, 126.59, 127.35, 128.17, 128.43, 127.37, 126.42, 126.90, 126.85, 125.65, 125.72, 127.16, 127.72, 127.69],
    low: [125.36, 126.16, 124.93, 126.09, 126.82, 126.48, 125.81, 124.83, 126.39, 125.72, 124.56, 124.57, 125.07, 126.86, 126.63],
    fastPeriod: 5,
    slowPeriod: 34
  };

  test('functional Awesome Oscillator should match reference implementation with real market data', () => {
    const ourResult = awesomeoscillator({ 
      fastPeriod: aoTestData.fastPeriod, 
      slowPeriod: aoTestData.slowPeriod,
      high: aoTestData.high, 
      low: aoTestData.low
    });
    
    const referenceResult = referenceAO({
      fastPeriod: aoTestData.fastPeriod,
      slowPeriod: aoTestData.slowPeriod,
      high: aoTestData.high,
      low: aoTestData.low
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    expect(ourResult).toHaveLength(aoTestData.high.length - aoTestData.slowPeriod + 1);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 4);
    }
  });

  test('functional Awesome Oscillator should work with small test data', () => {
    const ourResult = awesomeoscillator({ 
      fastPeriod: smallTestData.fastPeriod, 
      slowPeriod: smallTestData.slowPeriod,
      high: smallTestData.high, 
      low: smallTestData.low
    });
    
    const referenceResult = referenceAO({
      fastPeriod: smallTestData.fastPeriod,
      slowPeriod: smallTestData.slowPeriod,
      high: smallTestData.high,
      low: smallTestData.low
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 4);
    }
  });

  test('class-based Awesome Oscillator should work correctly with streaming data', () => {
    const ourAO = new AwesomeOscillator({ 
      fastPeriod: aoTestData.fastPeriod, 
      slowPeriod: aoTestData.slowPeriod,
      high: [], 
      low: [] 
    });
    const referenceResult = referenceAO({
      fastPeriod: aoTestData.fastPeriod,
      slowPeriod: aoTestData.slowPeriod,
      high: aoTestData.high,
      low: aoTestData.low
    });
    
    let streamResults: number[] = [];
    
    for (let i = 0; i < aoTestData.high.length; i++) {
      const result = ourAO.nextValue(aoTestData.high[i], aoTestData.low[i]);
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
    const emptyResult = awesomeoscillator({ fastPeriod: 5, slowPeriod: 34, high: [], low: [] });
    expect(emptyResult).toEqual([]);
    
    const shortDataResult = awesomeoscillator({ 
      fastPeriod: 5, 
      slowPeriod: aoTestData.high.length, 
      high: aoTestData.high.slice(0, 2), 
      low: aoTestData.low.slice(0, 2) 
    });
    expect(shortDataResult).toEqual([]);
  });
});