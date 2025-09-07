import { typicalprice, TypicalPrice } from '../src/chart-types/typical-price';
import testDataRaw from './data.json';

describe('Typical Price', () => {
  // Use all data points from data.json for testing
  const testDataArray = Array.isArray(testDataRaw) ? testDataRaw : [testDataRaw];
  const testData = testDataArray.map(d => ({
    high: d.high,
    low: d.low,
    close: d.close
  }));

  const highs = testData.map(d => d.high);
  const lows = testData.map(d => d.low);
  const closes = testData.map(d => d.close);

  // Small test data for edge cases
  const smallHighs = [10, 12, 11, 13, 14];
  const smallLows = [8, 9, 9, 10, 11];
  const smallCloses = [9, 11, 10, 12, 13];

  test('functional typicalprice should calculate correct values', () => {
    const result = typicalprice({
      high: highs,
      low: lows,
      close: closes
    });

    expect(result).toHaveLength(testData.length);
    
    // Verify first few calculations manually
    for (let i = 0; i < Math.min(5, result.length); i++) {
      const expected = (highs[i] + lows[i] + closes[i]) / 3;
      expect(result[i]).toBeCloseTo(expected, 10);
    }
  });

  test('functional typicalprice should work with small test data', () => {
    const result = typicalprice({
      high: smallHighs,
      low: smallLows,
      close: smallCloses
    });

    expect(result).toHaveLength(smallHighs.length);
    
    // Manual verification of typical price formula
    const expectedResults = [
      (10 + 8 + 9) / 3,    // 9
      (12 + 9 + 11) / 3,   // 10.666...
      (11 + 9 + 10) / 3,   // 10
      (13 + 10 + 12) / 3,  // 11.666...
      (14 + 11 + 13) / 3   // 12.666...
    ];

    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBeCloseTo(expectedResults[i], 10);
    }
  });

  test('class-based TypicalPrice should work correctly with streaming data', () => {
    const typicalPriceClass = new TypicalPrice();
    const streamResults: number[] = [];
    
    for (let i = 0; i < testData.length; i++) {
      const result = typicalPriceClass.nextValue(highs[i], lows[i], closes[i]);
      streamResults.push(result);
    }
    
    expect(streamResults).toHaveLength(testData.length);
    
    // Compare with functional version
    const functionalResult = typicalprice({
      high: highs,
      low: lows,
      close: closes
    });
    
    for (let i = 0; i < streamResults.length; i++) {
      expect(streamResults[i]).toBeCloseTo(functionalResult[i], 10);
    }
  });

  test('class-based TypicalPrice getResult should match functional version', () => {
    const typicalPriceClass = new TypicalPrice({
      high: highs,
      low: lows,
      close: closes
    });
    
    const classResult = typicalPriceClass.getResult();
    const functionalResult = typicalprice({
      high: highs,
      low: lows,
      close: closes
    });
    
    expect(classResult).toHaveLength(functionalResult.length);
    
    for (let i = 0; i < classResult.length; i++) {
      expect(classResult[i]).toBeCloseTo(functionalResult[i], 10);
    }
  });

  test('should handle edge cases', () => {
    // Empty arrays
    expect(typicalprice({ high: [], low: [], close: [] })).toEqual([]);
    
    // Mismatched array lengths
    expect(typicalprice({ high: [1, 2], low: [1], close: [1, 2] })).toEqual([]);
    expect(typicalprice({ high: [1], low: [1, 2], close: [1, 2] })).toEqual([]);
    
    // Missing data
    expect(typicalprice({ high: [], low: [1], close: [1] })).toEqual([]);
  });

  test('should handle single value', () => {
    const result = typicalprice({
      high: [10],
      low: [8],
      close: [9]
    });
    
    expect(result).toHaveLength(1);
    expect(result[0]).toBeCloseTo((10 + 8 + 9) / 3, 10);
  });
});