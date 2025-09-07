import { obv, OBV } from '../src/volume/obv';
import { obv as referenceOBV } from 'technicalindicators';
import testDataRaw from './data.json';

describe('OBV (On Balance Volume)', () => {
  // Use all data points from data.json for testing
  const testDataArray = Array.isArray(testDataRaw) ? testDataRaw : [testDataRaw];
  const obvTestData = {
    close: testDataArray.map(d => d.close),
    volume: testDataArray.map(d => d.volume)
  };

  const smallTestData = {
    close: [10, 10.15, 10.17, 10.13, 10.11, 10.15, 10.20, 10.20, 10.22, 10.21],
    volume: [25200, 30000, 25600, 32000, 23000, 40000, 36000, 20500, 23000, 27500]
  };

  test('functional OBV should match reference implementation with real market data', () => {
    const ourResult = obv({ 
      close: obvTestData.close, 
      volume: obvTestData.volume 
    });
    
    const referenceResult = referenceOBV({
      close: obvTestData.close,
      volume: obvTestData.volume
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i]).toBeCloseTo(referenceResult[i], 4);
    }
  });

  test('functional OBV should work with small test data', () => {
    const ourResult = obv({ 
      close: smallTestData.close, 
      volume: smallTestData.volume 
    });
    
    // Our correct implementation should return 9 values for 10 input values (skips first)
    expect(ourResult).toHaveLength(9);
    
    // Manual verification of first few values (starting from 0)
    // Start: 0
    // 10.15 > 10: add 30000 = 30000
    // 10.17 > 10.15: add 25600 = 55600
    // 10.13 < 10.17: subtract 32000 = 23600
    expect(ourResult[0]).toBe(30000);  // 0 + 30000
    expect(ourResult[1]).toBe(55600);  // 30000 + 25600
    expect(ourResult[2]).toBe(23600);  // 55600 - 32000
  });

  test('class-based OBV should work correctly with streaming data', () => {
    const ourOBV = new OBV({ close: [], volume: [] });
    const referenceResult = referenceOBV({
      close: obvTestData.close,
      volume: obvTestData.volume
    });
    
    let streamResults: number[] = [];
    
    for (let i = 0; i < obvTestData.close.length; i++) {
      const result = ourOBV.nextValue(obvTestData.close[i], obvTestData.volume[i]);
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
    const emptyResult = obv({ close: [], volume: [] });
    expect(emptyResult).toEqual([]);
    
    const mismatchedLengthResult = obv({ 
      close: obvTestData.close.slice(0, 3), 
      volume: obvTestData.volume.slice(0, 2) 
    });
    expect(mismatchedLengthResult).toEqual([]);
  });
});