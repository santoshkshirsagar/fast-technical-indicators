import { obv, OBV } from '../src/volume/obv';
import { obv as referenceOBV } from 'technicalindicators';

describe('OBV (On Balance Volume)', () => {
  const testData = {
    close: [10, 10.15, 10.17, 10.13, 10.11, 10.15, 10.20, 10.20, 10.22, 10.21],
    volume: [25200, 30000, 25600, 32000, 23000, 40000, 36000, 20500, 23000, 27500]
  };

  test('functional OBV should calculate correctly', () => {
    const ourResult = obv({ 
      close: testData.close, 
      volume: testData.volume 
    });
    
    // Our correct implementation should return 10 values for 10 input values
    expect(ourResult).toHaveLength(10);
    
    // Manual verification of first few values
    // Start: 25200 (first volume)
    // 10.15 > 10: add 30000 = 55200
    // 10.17 > 10.15: add 25600 = 80800
    // 10.13 < 10.17: subtract 32000 = 48800
    expect(ourResult[0]).toBe(25200);  // Starting volume
    expect(ourResult[1]).toBe(55200);  // 25200 + 30000
    expect(ourResult[2]).toBe(80800);  // 55200 + 25600
    expect(ourResult[3]).toBe(48800);  // 80800 - 32000
  });

  test('class-based OBV should work correctly', () => {
    const ourOBV = new OBV({ close: [], volume: [] });
    
    let streamResults: number[] = [];
    
    for (let i = 0; i < testData.close.length; i++) {
      const result = ourOBV.nextValue(testData.close[i], testData.volume[i]);
      if (result !== undefined) {
        streamResults.push(result);
      }
    }
    
    expect(streamResults).toHaveLength(10);
    
    // Verify streaming matches functional implementation
    const functionalResult = obv({ 
      close: testData.close, 
      volume: testData.volume 
    });
    
    for (let i = 0; i < streamResults.length; i++) {
      expect(streamResults[i]).toBe(functionalResult[i]);
    }
  });

  test('should handle edge cases', () => {
    const emptyResult = obv({ close: [], volume: [] });
    expect(emptyResult).toEqual([]);
    
    const mismatchedLengthResult = obv({ 
      close: [1, 2, 3], 
      volume: [100, 200] 
    });
    expect(mismatchedLengthResult).toEqual([]);
  });
});