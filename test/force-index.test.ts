import { forceindex, ForceIndex } from '../src/volume/force-index';
import { forceindex as referenceFI } from 'technicalindicators';

describe('Force Index', () => {
  const testData = {
    close: [125.85, 126.48, 125.01, 127.02, 127.32, 127.11, 126.80, 126.13, 126.53, 125.81],
    volume: [25200, 30000, 25600, 32000, 23000, 40000, 36000, 20500, 23000, 27500],
    period: 13
  };

  test('functional Force Index should match reference implementation', () => {
    const ourResult = forceindex({ 
      period: testData.period,
      close: testData.close, 
      volume: testData.volume 
    });
    
    const referenceResult = referenceFI({
      period: testData.period,
      close: testData.close,
      volume: testData.volume
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 0);
    }
  });

  test('class-based Force Index should work correctly', () => {
    const ourFI = new ForceIndex({ period: testData.period, close: [], volume: [] });
    const referenceResult = referenceFI({
      period: testData.period,
      close: testData.close,
      volume: testData.volume
    });
    
    let streamResults: number[] = [];
    
    for (let i = 0; i < testData.close.length; i++) {
      const result = ourFI.nextValue(testData.close[i], testData.volume[i]);
      if (result !== undefined) {
        streamResults.push(result);
      }
    }
    
    expect(streamResults).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < streamResults.length; i++) {
      expect(streamResults[i]).toBeCloseTo(referenceResult[i], 0);
    }
  });

  test('should handle edge cases', () => {
    const emptyResult = forceindex({ period: 13, close: [], volume: [] });
    expect(emptyResult).toEqual([]);
    
    const mismatchedLengthResult = forceindex({ 
      period: 13,
      close: [1, 2, 3], 
      volume: [100, 200] 
    });
    expect(mismatchedLengthResult).toEqual([]);
  });
});