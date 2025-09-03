import { kst, KST } from '../src/momentum/kst';
import { kst as referenceKST } from 'technicalindicators';

describe('KST (Know Sure Thing)', () => {
  const testData = {
    values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
    ROCPer1: 10,
    ROCPer2: 15,
    ROCPer3: 20,
    ROCPer4: 30,
    SMAROCPer1: 10,
    SMAROCPer2: 10,
    SMAROCPer3: 10,
    SMAROCPer4: 15,
    signalPeriod: 9
  };

  test('functional KST should match reference implementation', () => {
    const ourResult = kst({ 
      values: testData.values,
      ROCPer1: testData.ROCPer1,
      ROCPer2: testData.ROCPer2,
      ROCPer3: testData.ROCPer3,
      ROCPer4: testData.ROCPer4,
      SMAROCPer1: testData.SMAROCPer1,
      SMAROCPer2: testData.SMAROCPer2,
      SMAROCPer3: testData.SMAROCPer3,
      SMAROCPer4: testData.SMAROCPer4,
      signalPeriod: testData.signalPeriod
    });
    
    const referenceResult = referenceKST({
      values: testData.values,
      ROCPer1: testData.ROCPer1,
      ROCPer2: testData.ROCPer2,
      ROCPer3: testData.ROCPer3,
      ROCPer4: testData.ROCPer4,
      SMAROCPer1: testData.SMAROCPer1,
      SMAROCPer2: testData.SMAROCPer2,
      SMAROCPer3: testData.SMAROCPer3,
      SMAROCPer4: testData.SMAROCPer4,
      signalPeriod: testData.signalPeriod
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i].kst).toBeCloseTo(referenceResult[i].kst, 4);
      expect(ourResult[i].signal).toBeCloseTo(referenceResult[i].signal, 4);
    }
  });

  test('class-based KST should work correctly', () => {
    const ourKST = new KST({ 
      values: [],
      ROCPer1: testData.ROCPer1,
      ROCPer2: testData.ROCPer2,
      ROCPer3: testData.ROCPer3,
      ROCPer4: testData.ROCPer4,
      SMAROCPer1: testData.SMAROCPer1,
      SMAROCPer2: testData.SMAROCPer2,
      SMAROCPer3: testData.SMAROCPer3,
      SMAROCPer4: testData.SMAROCPer4,
      signalPeriod: testData.signalPeriod
    });
    const referenceResult = referenceKST({
      values: testData.values,
      ROCPer1: testData.ROCPer1,
      ROCPer2: testData.ROCPer2,
      ROCPer3: testData.ROCPer3,
      ROCPer4: testData.ROCPer4,
      SMAROCPer1: testData.SMAROCPer1,
      SMAROCPer2: testData.SMAROCPer2,
      SMAROCPer3: testData.SMAROCPer3,
      SMAROCPer4: testData.SMAROCPer4,
      signalPeriod: testData.signalPeriod
    });
    
    let streamResults: any[] = [];
    
    for (let i = 0; i < testData.values.length; i++) {
      const result = ourKST.nextValue(testData.values[i]);
      if (result !== undefined) {
        streamResults.push(result);
      }
    }
    
    expect(streamResults).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < streamResults.length; i++) {
      expect(streamResults[i].kst).toBeCloseTo(referenceResult[i].kst, 4);
      expect(streamResults[i].signal).toBeCloseTo(referenceResult[i].signal, 4);
    }
  });

  test('should handle edge cases', () => {
    const emptyResult = kst({ 
      values: [],
      ROCPer1: 10, ROCPer2: 15, ROCPer3: 20, ROCPer4: 30,
      SMAROCPer1: 10, SMAROCPer2: 10, SMAROCPer3: 10, SMAROCPer4: 15,
      signalPeriod: 9
    });
    expect(emptyResult).toEqual([]);
    
    const shortDataResult = kst({ 
      values: [1, 2, 3],
      ROCPer1: 10, ROCPer2: 15, ROCPer3: 20, ROCPer4: 30,
      SMAROCPer1: 10, SMAROCPer2: 10, SMAROCPer3: 10, SMAROCPer4: 15,
      signalPeriod: 9
    });
    expect(shortDataResult).toEqual([]);
  });
});