import { macd, MACD } from '../src/moving-averages/macd';
import { macd as referenceMACD } from 'technicalindicators';

describe('MACD (Moving Average Convergence Divergence)', () => {
  const testData = [22.27, 22.19, 22.08, 22.17, 22.18, 22.13, 22.23, 22.43, 22.24, 22.29, 22.15, 22.39, 22.38, 22.61, 23.36, 24.05, 23.75, 23.83, 23.95, 23.63, 23.82, 23.87, 23.65, 23.19, 23.10, 23.33, 22.68, 23.10, 22.40, 22.17, 22.35, 22.20, 22.39];
  
  const defaultConfig = {
    values: testData,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false
  };

  test('functional MACD should match reference implementation', () => {
    const ourResult = macd(defaultConfig);
    const referenceResult = referenceMACD(defaultConfig);
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      if (ourResult[i].MACD !== undefined && referenceResult[i].MACD !== undefined) {
        expect(ourResult[i].MACD!).toBeCloseTo(referenceResult[i].MACD!, 2);
      }
      
      if (ourResult[i].signal !== undefined && referenceResult[i].signal !== undefined) {
        expect(ourResult[i].signal!).toBeCloseTo(referenceResult[i].signal!, 2);
      }
      
      if (ourResult[i].histogram !== undefined && referenceResult[i].histogram !== undefined) {
        expect(ourResult[i].histogram!).toBeCloseTo(referenceResult[i].histogram!, 2);
      }
    }
  });

  test('class-based MACD should work correctly', () => {
    const ourMACD = new MACD(defaultConfig);
    const result = ourMACD.getResult();
    
    expect(result).toHaveLength(1);
    expect(result[0].MACD).toBeDefined();
  });

  test('streaming MACD should work correctly', () => {
    const ourMACD = new MACD({ 
      fastPeriod: 12, 
      slowPeriod: 26, 
      signalPeriod: 9, 
      values: [] 
    });
    
    const referenceResult = referenceMACD(defaultConfig);
    let streamResults: any[] = [];
    
    testData.forEach(value => {
      const result = ourMACD.nextValue(value);
      if (result !== undefined && result.MACD !== undefined) {
        streamResults.push(result);
      }
    });
    
    expect(streamResults.length).toBeGreaterThan(0);
    
    // Check last values match
    const lastStream = streamResults[streamResults.length - 1];
    const lastReference = referenceResult[referenceResult.length - 1];
    
    if (lastStream.MACD !== undefined && lastReference.MACD !== undefined) {
      expect(lastStream.MACD).toBeCloseTo(lastReference.MACD, 2);
    }
  });

  test('should handle edge cases', () => {
    const emptyResult = macd({ values: [], fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 });
    expect(emptyResult).toEqual([]);
    
    const shortDataResult = macd({ values: [1, 2, 3], fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 });
    expect(shortDataResult).toEqual([]);
  });
});