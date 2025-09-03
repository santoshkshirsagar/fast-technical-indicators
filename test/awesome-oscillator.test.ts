import { awesomeoscillator, AwesomeOscillator } from '../src/oscillators/awesome-oscillator';
import { awesomeoscillator as referenceAO } from 'technicalindicators';

describe('Awesome Oscillator', () => {
  const testData = {
    high: [127.01, 127.62, 126.59, 127.35, 128.17, 128.43, 127.37, 126.42, 126.90, 126.85, 125.65, 125.72, 127.16, 127.72, 127.69],
    low: [125.36, 126.16, 124.93, 126.09, 126.82, 126.48, 125.81, 124.83, 126.39, 125.72, 124.56, 124.57, 125.07, 126.86, 126.63],
    fastPeriod: 5,
    slowPeriod: 34
  };

  test('functional Awesome Oscillator should match reference implementation', () => {
    const ourResult = awesomeoscillator({ 
      fastPeriod: testData.fastPeriod, 
      slowPeriod: testData.slowPeriod,
      high: testData.high, 
      low: testData.low
    });
    
    const referenceResult = referenceAO({
      fastPeriod: testData.fastPeriod,
      slowPeriod: testData.slowPeriod,
      high: testData.high,
      low: testData.low
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 4);
    }
  });

  test('class-based Awesome Oscillator should work correctly', () => {
    const ourAO = new AwesomeOscillator({ 
      fastPeriod: testData.fastPeriod, 
      slowPeriod: testData.slowPeriod,
      high: [], 
      low: [] 
    });
    const referenceResult = referenceAO({
      fastPeriod: testData.fastPeriod,
      slowPeriod: testData.slowPeriod,
      high: testData.high,
      low: testData.low
    });
    
    let streamResults: number[] = [];
    
    for (let i = 0; i < testData.high.length; i++) {
      const result = ourAO.nextValue(testData.high[i], testData.low[i]);
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
      slowPeriod: 34, 
      high: [1, 2], 
      low: [1, 2] 
    });
    expect(shortDataResult).toEqual([]);
  });
});