import { kst, KST } from '../src/momentum/kst';
import { kst as referenceKST } from 'technicalindicators';
import testDataRaw from './data.json';

describe('KST (Know Sure Thing)', () => {
  // Use all data points from data.json for testing
  const testDataArray = Array.isArray(testDataRaw) ? testDataRaw : [testDataRaw];
  const kstTestData = {
    values: testDataArray.map(d => d.close),
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

  const smallTestData = {
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

  test('functional KST should match reference implementation with real market data', () => {
    const ourResult = kst({ 
      values: kstTestData.values,
      ROCPer1: kstTestData.ROCPer1,
      ROCPer2: kstTestData.ROCPer2,
      ROCPer3: kstTestData.ROCPer3,
      ROCPer4: kstTestData.ROCPer4,
      SMAROCPer1: kstTestData.SMAROCPer1,
      SMAROCPer2: kstTestData.SMAROCPer2,
      SMAROCPer3: kstTestData.SMAROCPer3,
      SMAROCPer4: kstTestData.SMAROCPer4,
      signalPeriod: kstTestData.signalPeriod
    });
    
    const referenceResult = referenceKST({
      values: kstTestData.values,
      ROCPer1: kstTestData.ROCPer1,
      ROCPer2: kstTestData.ROCPer2,
      ROCPer3: kstTestData.ROCPer3,
      ROCPer4: kstTestData.ROCPer4,
      SMAROCPer1: kstTestData.SMAROCPer1,
      SMAROCPer2: kstTestData.SMAROCPer2,
      SMAROCPer3: kstTestData.SMAROCPer3,
      SMAROCPer4: kstTestData.SMAROCPer4,
      signalPeriod: kstTestData.signalPeriod
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i].kst).toBeCloseTo(referenceResult[i].kst, 4);
      if (ourResult[i].signal !== undefined && referenceResult[i].signal !== undefined) {
        expect(ourResult[i].signal).toBeCloseTo(referenceResult[i].signal, 4);
      } else {
        expect(ourResult[i].signal).toBe(referenceResult[i].signal);
      }
    }
  });

  test('functional KST should work with small test data', () => {
    const ourResult = kst({ 
      values: smallTestData.values,
      ROCPer1: smallTestData.ROCPer1,
      ROCPer2: smallTestData.ROCPer2,
      ROCPer3: smallTestData.ROCPer3,
      ROCPer4: smallTestData.ROCPer4,
      SMAROCPer1: smallTestData.SMAROCPer1,
      SMAROCPer2: smallTestData.SMAROCPer2,
      SMAROCPer3: smallTestData.SMAROCPer3,
      SMAROCPer4: smallTestData.SMAROCPer4,
      signalPeriod: smallTestData.signalPeriod
    });
    
    const referenceResult = referenceKST({
      values: smallTestData.values,
      ROCPer1: smallTestData.ROCPer1,
      ROCPer2: smallTestData.ROCPer2,
      ROCPer3: smallTestData.ROCPer3,
      ROCPer4: smallTestData.ROCPer4,
      SMAROCPer1: smallTestData.SMAROCPer1,
      SMAROCPer2: smallTestData.SMAROCPer2,
      SMAROCPer3: smallTestData.SMAROCPer3,
      SMAROCPer4: smallTestData.SMAROCPer4,
      signalPeriod: smallTestData.signalPeriod
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i].kst).toBeCloseTo(referenceResult[i].kst, 4);
      if (ourResult[i].signal !== undefined && referenceResult[i].signal !== undefined) {
        expect(ourResult[i].signal).toBeCloseTo(referenceResult[i].signal, 4);
      } else {
        expect(ourResult[i].signal).toBe(referenceResult[i].signal);
      }
    }
  });

  test('class-based KST should work correctly with streaming data', () => {
    const ourKST = new KST({ 
      values: [],
      ROCPer1: kstTestData.ROCPer1,
      ROCPer2: kstTestData.ROCPer2,
      ROCPer3: kstTestData.ROCPer3,
      ROCPer4: kstTestData.ROCPer4,
      SMAROCPer1: kstTestData.SMAROCPer1,
      SMAROCPer2: kstTestData.SMAROCPer2,
      SMAROCPer3: kstTestData.SMAROCPer3,
      SMAROCPer4: kstTestData.SMAROCPer4,
      signalPeriod: kstTestData.signalPeriod
    });
    const referenceResult = referenceKST({
      values: kstTestData.values,
      ROCPer1: kstTestData.ROCPer1,
      ROCPer2: kstTestData.ROCPer2,
      ROCPer3: kstTestData.ROCPer3,
      ROCPer4: kstTestData.ROCPer4,
      SMAROCPer1: kstTestData.SMAROCPer1,
      SMAROCPer2: kstTestData.SMAROCPer2,
      SMAROCPer3: kstTestData.SMAROCPer3,
      SMAROCPer4: kstTestData.SMAROCPer4,
      signalPeriod: kstTestData.signalPeriod
    });
    
    let streamResults: any[] = [];
    
    for (let i = 0; i < kstTestData.values.length; i++) {
      const result = ourKST.nextValue(kstTestData.values[i]);
      if (result !== undefined) {
        streamResults.push(result);
      }
    }
    
    expect(streamResults).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < streamResults.length; i++) {
      expect(streamResults[i].kst).toBeCloseTo(referenceResult[i].kst, 4);
      if (streamResults[i].signal !== undefined && referenceResult[i].signal !== undefined) {
        expect(streamResults[i].signal).toBeCloseTo(referenceResult[i].signal, 4);
      } else {
        expect(streamResults[i].signal).toBe(referenceResult[i].signal);
      }
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
      values: kstTestData.values.slice(0, 3),
      ROCPer1: 10, ROCPer2: 15, ROCPer3: 20, ROCPer4: 30,
      SMAROCPer1: 10, SMAROCPer2: 10, SMAROCPer3: 10, SMAROCPer4: 15,
      signalPeriod: 9
    });
    expect(shortDataResult).toEqual([]);
  });
});