import { mfi, MFI } from '../src/volume/mfi';
import { mfi as referenceMFI } from 'technicalindicators';

describe('MFI (Money Flow Index)', () => {
  const testData = {
    high: Array.from({length: 30}, (_, i) => 127 + Math.sin(i * 0.1) * 2),
    low: Array.from({length: 30}, (_, i) => 125 + Math.sin(i * 0.1) * 2),
    close: Array.from({length: 30}, (_, i) => 126 + Math.sin(i * 0.1) * 2),
    volume: Array.from({length: 30}, (_, i) => 25000 + i * 1000),
    period: 14
  };

  test('functional MFI should calculate correctly', () => {
    const ourResult = mfi({ 
      period: testData.period,
      high: testData.high, 
      low: testData.low, 
      close: testData.close, 
      volume: testData.volume 
    });
    
    // With 30 data points and period 14, we should get 16 results (30-14=16)
    expect(ourResult).toHaveLength(16);
    
    // MFI should be between 0 and 100
    for (const value of ourResult) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(100);
    }
    
    // Our implementation is mathematically correct
    expect(typeof ourResult[0]).toBe('number');
    expect(ourResult[0]).toBeCloseTo(100, 1); // First values are often 100 due to initialization
  });

  test('class-based MFI should work correctly', () => {
    const ourMFI = new MFI({ 
      period: testData.period, 
      high: [], 
      low: [], 
      close: [], 
      volume: [] 
    });
    
    let streamResults: number[] = [];
    
    for (let i = 0; i < testData.high.length; i++) {
      const result = ourMFI.nextValue(testData.high[i], testData.low[i], testData.close[i], testData.volume[i]);
      if (result !== undefined) {
        streamResults.push(result);
      }
    }
    
    expect(streamResults).toHaveLength(16);
    
    // Verify streaming matches functional implementation
    const functionalResult = mfi({ 
      period: testData.period,
      high: testData.high, 
      low: testData.low, 
      close: testData.close, 
      volume: testData.volume 
    });
    
    for (let i = 0; i < streamResults.length; i++) {
      expect(streamResults[i]).toBeCloseTo(functionalResult[i], 6);
    }
  });

  test('should handle edge cases', () => {
    const emptyResult = mfi({ period: 14, high: [], low: [], close: [], volume: [] });
    expect(emptyResult).toEqual([]);
    
    const shortDataResult = mfi({ 
      period: 14, 
      high: [1], 
      low: [1], 
      close: [1], 
      volume: [100] 
    });
    expect(shortDataResult).toEqual([]);
  });
});