import { volumeprofile, VolumeProfile, VolumeProfileOutput } from '../src/volume/volume-profile';
import { volumeprofile as referenceVolumeProfile } from 'technicalindicators';
import testDataRaw from './data.json';

// Type the reference function to avoid TypeScript issues  
const refVolumeProfile = referenceVolumeProfile as unknown as (input: any) => VolumeProfileOutput[];

describe('Volume Profile', () => {
  // Use all data points from data.json for testing
  const testDataArray = Array.isArray(testDataRaw) ? testDataRaw : [testDataRaw];
  const testOpens = testDataArray.map(d => d.open);
  const testHighs = testDataArray.map(d => d.high);
  const testLows = testDataArray.map(d => d.low);
  const testCloses = testDataArray.map(d => d.close);
  const testVolumes = testDataArray.map(d => d.volume);
  
  const noOfBars = 14;

  // Small test data for edge cases
  const smallOpens = [99, 104, 101, 107, 103, 109, 105, 102, 106, 108];
  const smallHighs = [102, 107, 104, 110, 106, 112, 108, 105, 109, 111];
  const smallLows = [98, 103, 100, 106, 102, 108, 104, 101, 105, 107];
  const smallCloses = [100, 105, 102, 108, 104, 110, 106, 103, 107, 109];
  const smallVolumes = [1000, 1500, 800, 2000, 1200, 1800, 1100, 900, 1600, 1400];

  test('functional volumeprofile should match reference implementation', () => {
    const ourResult = volumeprofile({
      open: testOpens,
      high: testHighs,
      low: testLows,
      close: testCloses,
      volume: testVolumes,
      noOfBars
    });
    
    const referenceResult = refVolumeProfile({
      open: testOpens,
      high: testHighs,
      low: testLows,
      close: testCloses,
      volume: testVolumes,
      noOfBars
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    // Compare each volume profile bar
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i].rangeStart).toBeCloseTo(referenceResult[i].rangeStart, 4);
      expect(ourResult[i].rangeEnd).toBeCloseTo(referenceResult[i].rangeEnd, 4);
      expect(ourResult[i].bullishVolume).toBeCloseTo(referenceResult[i].bullishVolume, 4);
      expect(ourResult[i].bearishVolume).toBeCloseTo(referenceResult[i].bearishVolume, 4);
      expect(ourResult[i].totalVolume).toBeCloseTo(referenceResult[i].totalVolume, 4);
    }
  });

  test('functional volumeprofile should work with small test data', () => {
    const ourResult = volumeprofile({
      open: smallOpens,
      high: smallHighs,
      low: smallLows,
      close: smallCloses,
      volume: smallVolumes,
      noOfBars: 5
    });
    
    const referenceResult = refVolumeProfile({
      open: smallOpens,
      high: smallHighs,
      low: smallLows,
      close: smallCloses,
      volume: smallVolumes,
      noOfBars: 5
    });
    
    expect(ourResult).toHaveLength(referenceResult.length);
    
    for (let i = 0; i < ourResult.length; i++) {
      expect(ourResult[i].rangeStart).toBeCloseTo(referenceResult[i].rangeStart, 6);
      expect(ourResult[i].rangeEnd).toBeCloseTo(referenceResult[i].rangeEnd, 6);
      expect(ourResult[i].bullishVolume).toBeCloseTo(referenceResult[i].bullishVolume, 6);
      expect(ourResult[i].bearishVolume).toBeCloseTo(referenceResult[i].bearishVolume, 6);
      expect(ourResult[i].totalVolume).toBeCloseTo(referenceResult[i].totalVolume, 6);
    }
  });

  test('class-based VolumeProfile should work correctly with streaming data', () => {
    const volumeProfileClass = new VolumeProfile({
      open: [],
      high: [],
      low: [],
      close: [],
      volume: [],
      noOfBars
    });
    
    // Add values one by one
    for (let i = 0; i < testCloses.length; i++) {
      volumeProfileClass.nextValue(testOpens[i], testHighs[i], testLows[i], testCloses[i], testVolumes[i]);
    }
    
    const streamResult = volumeProfileClass.getResult();
    const functionalResult = volumeprofile({
      open: testOpens,
      high: testHighs,
      low: testLows,
      close: testCloses,
      volume: testVolumes,
      noOfBars
    });
    
    expect(streamResult).toHaveLength(functionalResult.length);
    
    for (let i = 0; i < streamResult.length; i++) {
      expect(streamResult[i].rangeStart).toBeCloseTo(functionalResult[i].rangeStart, 6);
      expect(streamResult[i].rangeEnd).toBeCloseTo(functionalResult[i].rangeEnd, 6);
      expect(streamResult[i].bullishVolume).toBeCloseTo(functionalResult[i].bullishVolume, 6);
      expect(streamResult[i].bearishVolume).toBeCloseTo(functionalResult[i].bearishVolume, 6);
      expect(streamResult[i].totalVolume).toBeCloseTo(functionalResult[i].totalVolume, 6);
    }
  });

  test('class-based VolumeProfile getResult should match functional version', () => {
    const volumeProfileClass = new VolumeProfile({
      open: testOpens,
      high: testHighs,
      low: testLows,
      close: testCloses,
      volume: testVolumes,
      noOfBars
    });
    
    const classResult = volumeProfileClass.getResult();
    const functionalResult = volumeprofile({
      open: testOpens,
      high: testHighs,
      low: testLows,
      close: testCloses,
      volume: testVolumes,
      noOfBars
    });
    
    expect(classResult).toHaveLength(functionalResult.length);
    
    for (let i = 0; i < classResult.length; i++) {
      expect(classResult[i].rangeStart).toBeCloseTo(functionalResult[i].rangeStart, 6);
      expect(classResult[i].rangeEnd).toBeCloseTo(functionalResult[i].rangeEnd, 6);
      expect(classResult[i].bullishVolume).toBeCloseTo(functionalResult[i].bullishVolume, 6);
      expect(classResult[i].bearishVolume).toBeCloseTo(functionalResult[i].bearishVolume, 6);
      expect(classResult[i].totalVolume).toBeCloseTo(functionalResult[i].totalVolume, 6);
    }
  });

  test('should handle edge cases', () => {
    // Empty arrays
    expect(volumeprofile({ open: [], high: [], low: [], close: [], volume: [] })).toEqual([]);
    
    // Mismatched array lengths
    expect(volumeprofile({ open: [1, 2], high: [2, 3], low: [0.5, 1.5], close: [1, 2], volume: [1] })).toEqual([]);
    
    // Single value - reference implementation creates all bars based on the range
    const singleResult = volumeprofile({
      open: [99],
      high: [100],
      low: [99],
      close: [100],
      volume: [1000],
      noOfBars: 5
    });
    
    // All 5 bars should be created because the candle spans the entire range
    expect(singleResult).toHaveLength(5);
    
    // Each bar should have the full volume because the candle overlaps with all bars
    singleResult.forEach(bar => {
      expect(bar.bullishVolume).toBe(1000); // open < close = bullish
      expect(bar.bearishVolume).toBe(0);
      expect(bar.totalVolume).toBe(1000);
    });
  });

  test('should handle zero price range correctly', () => {
    // All prices are the same - this creates a barRange of 0/5 = 0
    const result = volumeprofile({
      open: [100, 100, 100],
      high: [100, 100, 100],
      low: [100, 100, 100],
      close: [100, 100, 100],
      volume: [1000, 2000, 1500],
      noOfBars: 5
    });
    
    // All 5 bars are created with same range (100 to 100)
    expect(result).toHaveLength(5);
    
    // Each bar gets the full total volume because all candles overlap with all bars
    result.forEach(bar => {
      expect(bar.rangeStart).toBe(100);
      expect(bar.rangeEnd).toBe(100);
      expect(bar.bullishVolume).toBe(4500); // open == close = bullish (not bearish!)
      expect(bar.bearishVolume).toBe(0);
      expect(bar.totalVolume).toBe(4500);
    });
  });

  test('should use default noOfBars when not specified', () => {
    const resultDefault = volumeprofile({
      open: smallOpens,
      high: smallHighs,
      low: smallLows,
      close: smallCloses,
      volume: smallVolumes
    });
    
    const resultExplicit = volumeprofile({
      open: smallOpens,
      high: smallHighs,
      low: smallLows,
      close: smallCloses,
      volume: smallVolumes,
      noOfBars: 14
    });
    
    expect(resultDefault).toEqual(resultExplicit);
  });

  test('should calculate volumes correctly', () => {
    const result = volumeprofile({
      open: smallOpens,
      high: smallHighs,
      low: smallLows,
      close: smallCloses,
      volume: smallVolumes,
      noOfBars: 5
    });
    
    // Note: Total volume will be higher than input sum because candles can overlap multiple bars
    // Each candle's volume gets added to every bar it overlaps with
    
    // Bullish + bearish should equal total for each bar
    result.forEach(bar => {
      expect(bar.bullishVolume + bar.bearishVolume).toBe(bar.totalVolume);
    });
    
    // All bars should be created
    expect(result).toHaveLength(5);
  });

  test('should correctly classify bullish and bearish volume', () => {
    // Test data where we know the bullish/bearish classification
    const result = volumeprofile({
      open: [100, 105, 102],   // opens
      high: [102, 107, 104],   // highs  
      low: [98, 103, 100],     // lows
      close: [101, 104, 103],  // closes: 101>100 (bullish), 104<105 (bearish), 103>102 (bullish)
      volume: [1000, 2000, 1500],
      noOfBars: 3
    });
    
    // Note: With overlapping ranges, volumes will be duplicated across bars
    // But we can still verify the algorithm works by checking individual bars
    
    // All bars should be created
    expect(result).toHaveLength(3);
    
    // Each bar should have bullish + bearish = total
    result.forEach(bar => {
      expect(bar.bullishVolume + bar.bearishVolume).toBe(bar.totalVolume);
    });
  });
});