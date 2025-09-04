/**
 * Compatibility Test for API compatibility with technicalindicators package
 * This test verifies that all critical fixes are working correctly
 */

const { existsSync } = require('fs');
const { resolve } = require('path');

// Check if the built library exists
const distPath = resolve('./dist/index.cjs');
if (!existsSync(distPath)) {
  console.log('❌ Built library not found. Please run: npm run build');
  process.exit(1);
}

// Import the library
let myLib;
try {
  myLib = require('./dist/index.cjs');
} catch (error) {
  console.log('❌ Failed to import library:', error.message);
  process.exit(1);
}

console.log('🧪 API Compatibility Test Suite\n');

let testsPassed = 0;
let testsFailed = 0;

function test(description, testFn) {
  try {
    testFn();
    console.log('✅', description);
    testsPassed++;
  } catch (error) {
    console.log('❌', description, '-', error.message);
    testsFailed++;
  }
}

// Test data with sufficient length for all indicators
const testPrices = [
  44.00, 44.34, 44.09, 44.15, 43.61, 44.33, 44.83, 45.85,
  46.08, 47.37, 47.54, 46.80, 47.31, 47.20, 46.80, 46.80,
  46.83, 47.69, 47.54, 49.25, 49.23, 48.2, 47.8, 47.31,
  49.25, 50.19, 50.54, 50.13, 51.55, 52.89, 53.73, 53.87,
  53.00, 51.62, 52.78, 52.32, 52.23, 53.38, 53.48, 52.05,
  50.95, 50.24, 50.21, 49.93, 49.50, 49.25, 48.90, 49.87,
  50.19, 50.36, 50.57, 50.65, 50.43, 49.63, 50.33, 50.29
];

const testHighPrices = testPrices.map(p => p + Math.random() * 2);
const testLowPrices = testPrices.map(p => p - Math.random() * 2);
const testVolume = testPrices.map(() => Math.floor(Math.random() * 1000000));

console.log('1. Testing Method Name Aliases (CRITICAL)\n');

// Test keltnerchannels alias
test('keltnerchannels method exists', () => {
  if (typeof myLib.keltnerchannels !== 'function') {
    throw new Error('keltnerchannels is not a function');
  }
});

test('keltnerchannels produces output', () => {
  const result = myLib.keltnerchannels({
    high: testHighPrices.slice(0, 20),
    low: testLowPrices.slice(0, 20),
    close: testPrices.slice(0, 20),
    period: 10
  });
  if (!Array.isArray(result) || result.length === 0) {
    throw new Error('keltnerchannels did not produce valid output');
  }
});

// Test ichimokucloud alias
test('ichimokucloud method exists', () => {
  if (typeof myLib.ichimokucloud !== 'function') {
    throw new Error('ichimokucloud is not a function');
  }
});

test('ichimokucloud produces output', () => {
  const result = myLib.ichimokucloud({
    high: testHighPrices,
    low: testLowPrices,
    conversionPeriod: 9,
    basePeriod: 26,
    spanPeriod: 52,
    displacement: 26
  });
  if (!Array.isArray(result)) {
    throw new Error('ichimokucloud did not produce valid output');
  }
});

// Test fibonacciretracement alias
test('fibonacciretracement method exists', () => {
  if (typeof myLib.fibonacciretracement !== 'function') {
    throw new Error('fibonacciretracement is not a function');
  }
});

test('fibonacciretracement produces output', () => {
  const result = myLib.fibonacciretracement({
    high: Math.max(...testPrices),
    low: Math.min(...testPrices)
  });
  if (!result || typeof result !== 'object') {
    throw new Error('fibonacciretracement did not produce valid output');
  }
});

console.log('\n2. Testing Utility Classes\n');

// Test CandleData class
test('CandleData class exists', () => {
  if (typeof myLib.CandleData !== 'function') {
    throw new Error('CandleData is not a constructor');
  }
});

test('CandleData instantiation works', () => {
  const candle = new myLib.CandleData(100, 105, 99, 102, 50000);
  if (candle.open !== 100 || candle.high !== 105 || candle.low !== 99 || candle.close !== 102) {
    throw new Error('CandleData properties not set correctly');
  }
});

// Test getAvailableIndicators function
test('getAvailableIndicators function exists', () => {
  if (typeof myLib.getAvailableIndicators !== 'function') {
    throw new Error('getAvailableIndicators is not a function');
  }
});

test('getAvailableIndicators returns array', () => {
  const indicators = myLib.getAvailableIndicators();
  if (!Array.isArray(indicators) || indicators.length === 0) {
    throw new Error('getAvailableIndicators did not return a valid array');
  }
});

test('getAvailableIndicators includes expected indicators', () => {
  const indicators = myLib.getAvailableIndicators();
  const expectedIndicators = ['sma', 'rsi', 'macd', 'keltnerchannels', 'ichimokucloud', 'fibonacciretracement'];
  
  for (const expected of expectedIndicators) {
    if (!indicators.includes(expected)) {
      throw new Error(`Missing indicator: ${expected}`);
    }
  }
});

console.log('\n3. Testing Core Functionality (Regression Check)\n');

// Test that original methods still work
test('Original sma function works', () => {
  const result = myLib.sma({ period: 5, values: testPrices.slice(0, 10) });
  if (!Array.isArray(result) || result.length === 0) {
    throw new Error('sma function failed');
  }
});

test('Original rsi function works', () => {
  const result = myLib.rsi({ period: 14, values: testPrices.slice(0, 20) });
  if (!Array.isArray(result) || result.length === 0) {
    throw new Error('rsi function failed');
  }
});

test('Original macd function works', () => {
  const result = myLib.macd({ 
    values: testPrices.slice(0, 30), 
    fastPeriod: 12, 
    slowPeriod: 26, 
    signalPeriod: 9 
  });
  if (!Array.isArray(result) || result.length === 0) {
    throw new Error('macd function failed');
  }
});

test('StochasticRSI output compatibility', () => {
  const result = myLib.stochasticrsi({
    values: testPrices.slice(0, 30),
    rsiPeriod: 14,
    stochasticPeriod: 14,
    kPeriod: 3,
    dPeriod: 3
  });
  
  if (!Array.isArray(result) || result.length === 0) {
    throw new Error('stochasticrsi failed to produce output');
  }
  
  const firstResult = result.find(r => r !== undefined);
  if (!firstResult || !firstResult.hasOwnProperty('stochRSI') || 
      !firstResult.hasOwnProperty('k') || !firstResult.hasOwnProperty('d')) {
    throw new Error('stochasticrsi output structure incorrect - should have {stochRSI, k, d}');
  }
});

console.log('\n4. Testing Output Structure Compatibility\n');

test('MACD output structure matches', () => {
  const result = myLib.macd({ 
    values: testPrices.slice(0, 30), 
    fastPeriod: 12, 
    slowPeriod: 26, 
    signalPeriod: 9 
  });
  
  const firstResult = result.find(r => r !== undefined);
  if (!firstResult || !firstResult.hasOwnProperty('MACD') || 
      !firstResult.hasOwnProperty('signal') || !firstResult.hasOwnProperty('histogram')) {
    throw new Error('MACD output structure incorrect - should have {MACD, signal, histogram}');
  }
});

test('Bollinger Bands output structure matches', () => {
  const result = myLib.bollingerbands({ 
    period: 20, 
    values: testPrices.slice(0, 25),
    stdDev: 2
  });
  
  const firstResult = result.find(r => r !== undefined);
  if (!firstResult || !firstResult.hasOwnProperty('middle') || 
      !firstResult.hasOwnProperty('upper') || !firstResult.hasOwnProperty('lower') ||
      !firstResult.hasOwnProperty('pb')) {
    throw new Error('Bollinger Bands output structure incorrect - should have {middle, upper, lower, pb}');
  }
});

test('ADX output structure matches', () => {
  const result = myLib.adx({
    high: testHighPrices.slice(0, 25),
    low: testLowPrices.slice(0, 25),
    close: testPrices.slice(0, 25),
    period: 14
  });
  
  const firstResult = result.find(r => r !== undefined);
  if (!firstResult || !firstResult.hasOwnProperty('adx') || 
      !firstResult.hasOwnProperty('pdi') || !firstResult.hasOwnProperty('mdi')) {
    throw new Error('ADX output structure incorrect - should have {adx, pdi, mdi}');
  }
});

// Summary
console.log('\n📊 Test Results Summary\n');
console.log(`✅ Tests Passed: ${testsPassed}`);
console.log(`❌ Tests Failed: ${testsFailed}`);
console.log(`📈 Success Rate: ${Math.round((testsPassed / (testsPassed + testsFailed)) * 100)}%`);

if (testsFailed === 0) {
  console.log('\n🎉 All compatibility tests PASSED! Library is ready for drop-in replacement.');
} else {
  console.log('\n⚠️  Some tests FAILED. Please review and fix the issues above.');
  process.exit(1);
}