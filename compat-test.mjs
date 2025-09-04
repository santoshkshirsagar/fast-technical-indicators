import ti from 'technicalindicators';
import * as myLib from './dist/index.js';

console.log('=== API COMPATIBILITY AUDIT ===\n');

// Test data
const testData = Array.from({length: 50}, (_, i) => 50 + Math.sin(i * 0.1) * 10);
const highData = testData.map(x => x + 2);
const lowData = testData.map(x => x - 2);

const issues = [];

console.log('1. CRITICAL INDICATOR TESTS');
console.log('============================');

// MACD Test
try {
    const tiMacd = ti.macd({values: testData, fastPeriod: 12, slowPeriod: 26, signalPeriod: 9});
    const myMacd = myLib.macd({values: testData, fastPeriod: 12, slowPeriod: 26, signalPeriod: 9});
    
    const tiKeys = Object.keys(tiMacd[0] || {}).sort();
    const myKeys = Object.keys(myMacd[0] || {}).sort();
    
    console.log('MACD Output Keys:');
    console.log(`  TI: [${tiKeys.join(', ')}]`);
    console.log(`  Ours: [${myKeys.join(', ')}]`);
    
    if (JSON.stringify(tiKeys) !== JSON.stringify(myKeys)) {
        issues.push(`CRITICAL: MACD output keys mismatch - TI: [${tiKeys.join(', ')}], Ours: [${myKeys.join(', ')}]`);
    }
} catch (e) {
    issues.push(`MACD_ERROR: ${e.message}`);
}

// StochasticRSI Test - KNOWN ISSUE  
try {
    const tiStochRsi = ti.stochasticrsi({values: testData, rsiPeriod: 14, stochasticPeriod: 14, kPeriod: 3, dPeriod: 3});
    const myStochRsi = myLib.stochasticrsi({values: testData, rsiPeriod: 14, stochasticPeriod: 14, kPeriod: 3, dPeriod: 3});
    
    const tiKeys = Object.keys(tiStochRsi[0] || {}).sort();
    const myKeys = Object.keys(myStochRsi[0] || {}).sort();
    
    console.log('\nStochasticRSI Output Keys:');
    console.log(`  TI: [${tiKeys.join(', ')}]`);
    console.log(`  Ours: [${myKeys.join(', ')}]`);
    
    if (JSON.stringify(tiKeys) !== JSON.stringify(myKeys)) {
        issues.push(`CRITICAL: StochasticRSI output keys mismatch - TI: [${tiKeys.join(', ')}], Ours: [${myKeys.join(', ')}]`);
    }
} catch (e) {
    issues.push(`STOCHASTICRSI_ERROR: ${e.message}`);
}

// Bollinger Bands Test
try {
    const tiBb = ti.bollingerbands({period: 20, stdDev: 2, values: testData});
    const myBb = myLib.bollingerbands({period: 20, stdDev: 2, values: testData});
    
    const tiKeys = Object.keys(tiBb[0] || {}).sort();
    const myKeys = Object.keys(myBb[0] || {}).sort();
    
    console.log('\nBollinger Bands Output Keys:');
    console.log(`  TI: [${tiKeys.join(', ')}]`);
    console.log(`  Ours: [${myKeys.join(', ')}]`);
    
    if (JSON.stringify(tiKeys) !== JSON.stringify(myKeys)) {
        issues.push(`BollingerBands output keys mismatch - TI: [${tiKeys.join(', ')}], Ours: [${myKeys.join(', ')}]`);
    }
} catch (e) {
    issues.push(`BOLLINGERBANDS_ERROR: ${e.message}`);
}

console.log('\n2. METHOD NAMING CHECKS');
console.log('========================');

// Check for method name mismatches
const criticalMethods = [
    'rsi', 'sma', 'ema', 'macd', 'bollingerbands', 'stochasticrsi',
    'RSI', 'SMA', 'EMA', 'MACD', 'BollingerBands', 'StochasticRSI'
];

criticalMethods.forEach(method => {
    const tiHas = typeof ti[method] === 'function';
    const myLibHas = typeof myLib[method] === 'function';
    
    console.log(`${method}: TI=${tiHas}, Ours=${myLibHas}`);
    
    if (tiHas && !myLibHas) {
        issues.push(`MISSING_METHOD: '${method}' exists in TI but not in our library`);
    }
});

// Check specific naming differences we know about
const namingIssues = [
    ['keltnerchannels', 'keltnerchannel'],
    ['ichimokucloud', 'ichimokukinkouhyou'],
];

console.log('\n3. KNOWN NAMING DIFFERENCES');
console.log('============================');

namingIssues.forEach(([tiName, ourName]) => {
    const tiHas = typeof ti[tiName] === 'function';
    const ourHas = typeof myLib[ourName] === 'function';
    
    console.log(`${tiName} vs ${ourName}: TI=${tiHas}, Ours=${ourHas}`);
    
    if (tiHas && !ourHas) {
        issues.push(`NAMING_MISMATCH: TI uses '${tiName}' but we use '${ourName}'`);
    }
});

console.log('\n=== COMPATIBILITY ISSUES SUMMARY ===');
if (issues.length === 0) {
    console.log('✓ No major compatibility issues found!');
} else {
    console.log(`❌ Found ${issues.length} compatibility issues:\n`);
    issues.forEach((issue, i) => {
        console.log(`${i + 1}. ${issue}`);
    });
}

console.log('\nNext steps needed:');
console.log('- Fix StochasticRSI output key naming (stochRSI vs stochrsi)');
console.log('- Check method naming consistency');
console.log('- Verify all parameter names match exactly');
console.log('- Test class constructors compatibility');