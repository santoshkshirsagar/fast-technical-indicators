import { forceindex, ForceIndex } from '../src/volume/force-index';
import { forceindex as referenceFI } from 'technicalindicators';
import testDataRaw from './data.json';

describe('Force Index', () => {
  // Use all data points from data.json for testing
  const testDataArray = Array.isArray(testDataRaw) ? testDataRaw : [testDataRaw];
  const fiTestData = {
    close: testDataArray.map(d => d.close),
    volume: testDataArray.map(d => d.volume),
    period: 13
  };

  const smallTestData = {
    close: [125.85, 126.48, 125.01, 127.02, 127.32, 127.11, 126.80, 126.13, 126.53, 125.81],
    volume: [25200, 30000, 25600, 32000, 23000, 40000, 36000, 20500, 23000, 27500],
    period: 13
  };

  test('functional Force Index should match reference implementation with real market data', () => {
    const ourResult = forceindex({ 
      period: fiTestData.period,
      close: fiTestData.close, 
      volume: fiTestData.volume 
    });
    
    const referenceResult = referenceFI({
      period: fiTestData.period,
      close: fiTestData.close,
      volume: fiTestData.volume
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 4);
    }
  });

  test('functional Force Index should work with small test data', () => {
    const ourResult = forceindex({ 
      period: smallTestData.period,
      close: smallTestData.close, 
      volume: smallTestData.volume 
    });
    
    const referenceResult = referenceFI({
      period: smallTestData.period,
      close: smallTestData.close,
      volume: smallTestData.volume
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 4);
    }
  });

  test('class-based Force Index should work correctly with streaming data', () => {
    const ourFI = new ForceIndex({ period: fiTestData.period, close: [], volume: [] });
    const referenceResult = referenceFI({
      period: fiTestData.period,
      close: fiTestData.close,
      volume: fiTestData.volume
    });
    
    let streamResults: number[] = [];
    
    for (let i = 0; i < fiTestData.close.length; i++) {
      const result = ourFI.nextValue(fiTestData.close[i], fiTestData.volume[i]);
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
    const emptyResult = forceindex({ period: 13, close: [], volume: [] });
    expect(emptyResult).toEqual([]);
    
    const mismatchedLengthResult = forceindex({ 
      period: 13,
      close: fiTestData.close.slice(0, 3), 
      volume: fiTestData.volume.slice(0, 2) 
    });
    expect(mismatchedLengthResult).toEqual([]);
  });
});