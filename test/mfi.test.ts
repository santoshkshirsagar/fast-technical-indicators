import { mfi, MFI } from '../src/volume/mfi';
import { mfi as referenceMFI } from 'technicalindicators';
import testDataRaw from './data.json';

describe('MFI (Money Flow Index)', () => {
  // Use all data points from data.json for testing
  const testDataArray = Array.isArray(testDataRaw) ? testDataRaw : [testDataRaw];
  const mfiTestData = {
    high: testDataArray.map(d => d.high),
    low: testDataArray.map(d => d.low),
    close: testDataArray.map(d => d.close),
    volume: testDataArray.map(d => d.volume),
    period: 14
  };

  const smallTestData = {
    high: Array.from({length: 30}, (_, i) => 127 + Math.sin(i * 0.1) * 2),
    low: Array.from({length: 30}, (_, i) => 125 + Math.sin(i * 0.1) * 2),
    close: Array.from({length: 30}, (_, i) => 126 + Math.sin(i * 0.1) * 2),
    volume: Array.from({length: 30}, (_, i) => 25000 + i * 1000),
    period: 14
  };

  test('functional MFI should match reference implementation with real market data', () => {
    const ourResult = mfi({ 
      period: mfiTestData.period,
      high: mfiTestData.high, 
      low: mfiTestData.low, 
      close: mfiTestData.close, 
      volume: mfiTestData.volume 
    });
    
    const referenceResult = referenceMFI({
      period: mfiTestData.period,
      high: mfiTestData.high,
      low: mfiTestData.low,
      close: mfiTestData.close,
      volume: mfiTestData.volume
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 4);
    }
  });

  test('functional MFI should work with small test data', () => {
    const ourResult = mfi({ 
      period: smallTestData.period,
      high: smallTestData.high, 
      low: smallTestData.low, 
      close: smallTestData.close, 
      volume: smallTestData.volume 
    });
    
    // With 30 data points and period 14, we should get 15 results (reference behavior)
    expect(ourResult).toHaveLength(15);
    
    // MFI should be between 0 and 100
    for (const value of ourResult) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(100);
    }
    
    // Our implementation is mathematically correct
    expect(typeof ourResult[0]).toBe('number');
    expect(ourResult[0]).toBeCloseTo(100, 1); // First values are often 100 due to initialization
  });

  test('class-based MFI should work correctly with streaming data', () => {
    const ourMFI = new MFI({ 
      period: mfiTestData.period, 
      high: [], 
      low: [], 
      close: [], 
      volume: [] 
    });
    
    const referenceResult = referenceMFI({
      period: mfiTestData.period,
      high: mfiTestData.high,
      low: mfiTestData.low,
      close: mfiTestData.close,
      volume: mfiTestData.volume
    });
    
    let streamResults: number[] = [];
    
    for (let i = 0; i < mfiTestData.high.length; i++) {
      const result = ourMFI.nextValue(mfiTestData.high[i], mfiTestData.low[i], mfiTestData.close[i], mfiTestData.volume[i]);
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
    const emptyResult = mfi({ period: 14, high: [], low: [], close: [], volume: [] });
    expect(emptyResult).toEqual([]);
    
    const shortDataResult = mfi({ 
      period: mfiTestData.high.length, 
      high: mfiTestData.high.slice(0, 1), 
      low: mfiTestData.low.slice(0, 1), 
      close: mfiTestData.close.slice(0, 1), 
      volume: mfiTestData.volume.slice(0, 1) 
    });
    expect(shortDataResult).toEqual([]);
  });
});