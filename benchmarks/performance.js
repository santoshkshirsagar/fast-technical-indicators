const { sma, ema, rsi, macd, wma, cci, stochastic, bollingerbands, atr, obv, williamsr } = require('../dist/index.cjs');
const { 
  sma: refSMA, 
  ema: refEMA, 
  rsi: refRSI, 
  macd: refMACD,
  wma: refWMA,
  cci: refCCI,
  stochastic: refStochastic,
  bollingerbands: refBollingerBands,
  atr: refATR,
  obv: refOBV,
  williamsR: refWilliamsR
} = require('technicalindicators');

// Generate large test dataset
function generateTestData(size) {
  const data = [];
  let price = 100;
  
  for (let i = 0; i < size; i++) {
    price += (Math.random() - 0.5) * 2; // Random walk
    data.push(Math.max(price, 1)); // Avoid negative prices
  }
  
  return data;
}

// Generate OHLC test data for indicators that need it
function generateOHLCData(size) {
  const data = [];
  let close = 100;
  
  for (let i = 0; i < size; i++) {
    const change = (Math.random() - 0.5) * 4;
    const open = close;
    close = Math.max(open + change, 1);
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;
    
    data.push({
      open: Math.max(low, open),
      high: Math.max(high, low + 0.01),
      low: Math.max(low, 0.01),
      close: Math.max(close, 0.01),
      volume: Math.floor(Math.random() * 100000) + 10000
    });
  }
  
  return data;
}

function benchmark(name, fn, iterations = 1000) {
  const start = process.hrtime.bigint();
  
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  
  const end = process.hrtime.bigint();
  const timeMs = Number(end - start) / 1_000_000;
  
  console.log(`${name}: ${timeMs.toFixed(2)}ms (${iterations} iterations)`);
  return timeMs;
}

function runBenchmarks() {
  console.log('🚀 Performance Benchmark: Fast Technical Indicators vs Reference Package');
  console.log('=' .repeat(70));
  
  // Test different data sizes
  const sizes = [100, 1000, 10000];
  
  sizes.forEach(size => {
    console.log(`\n📊 Data Size: ${size.toLocaleString()} points`);
    console.log('-'.repeat(40));
    
    const testData = generateTestData(size);
    const ohlcData = generateOHLCData(size);
    
    // SMA Benchmark
    console.log('\n📈 SMA (period: 20)');
    const smaConfig = { period: 20, values: testData };
    
    const ourSMATime = benchmark('Our SMA', () => sma(smaConfig));
    const refSMATime = benchmark('Reference SMA', () => refSMA(smaConfig));
    
    const smaSpeedup = (refSMATime / ourSMATime).toFixed(2);
    console.log(`⚡ Speedup: ${smaSpeedup}x`);
    
    // EMA Benchmark
    console.log('\n📈 EMA (period: 20)');
    const emaConfig = { period: 20, values: testData };
    
    const ourEMATime = benchmark('Our EMA', () => ema(emaConfig));
    const refEMATime = benchmark('Reference EMA', () => refEMA(emaConfig));
    
    const emaSpeedup = (refEMATime / ourEMATime).toFixed(2);
    console.log(`⚡ Speedup: ${emaSpeedup}x`);
    
    // RSI Benchmark
    if (size >= 15) {
      console.log('\n📈 RSI (period: 14)');
      const rsiConfig = { period: 14, values: testData };
      
      const ourRSITime = benchmark('Our RSI', () => rsi(rsiConfig));
      const refRSITime = benchmark('Reference RSI', () => refRSI(rsiConfig));
      
      const rsiSpeedup = (refRSITime / ourRSITime).toFixed(2);
      console.log(`⚡ Speedup: ${rsiSpeedup}x`);
    }
    
    // MACD Benchmark
    if (size >= 26) {
      console.log('\n📈 MACD (12,26,9)');
      const macdConfig = { 
        values: testData, 
        fastPeriod: 12, 
        slowPeriod: 26, 
        signalPeriod: 9 
      };
      
      const ourMACDTime = benchmark('Our MACD', () => macd(macdConfig));
      const refMACDTime = benchmark('Reference MACD', () => refMACD(macdConfig));
      
      const macdSpeedup = (refMACDTime / ourMACDTime).toFixed(2);
      console.log(`⚡ Speedup: ${macdSpeedup}x`);
    }
    
    // WMA Benchmark
    console.log('\n📈 WMA (period: 20)');
    const wmaConfig = { period: 20, values: testData };
    
    const ourWMATime = benchmark('Our WMA', () => wma(wmaConfig));
    const refWMATime = benchmark('Reference WMA', () => refWMA(wmaConfig));
    
    const wmaSpeedup = (refWMATime / ourWMATime).toFixed(2);
    console.log(`⚡ Speedup: ${wmaSpeedup}x`);
    
    // CCI Benchmark
    if (size >= 20) {
      console.log('\n📈 CCI (period: 20)');
      const cciConfig = { period: 20, high: ohlcData.map(d => d.high), low: ohlcData.map(d => d.low), close: ohlcData.map(d => d.close) };
      
      const ourCCITime = benchmark('Our CCI', () => cci(cciConfig));
      const refCCITime = benchmark('Reference CCI', () => refCCI(cciConfig));
      
      const cciSpeedup = (refCCITime / ourCCITime).toFixed(2);
      console.log(`⚡ Speedup: ${cciSpeedup}x`);
    }
    
    // Stochastic Benchmark
    if (size >= 14) {
      console.log('\n📈 Stochastic (14,3,3)');
      const stochConfig = { 
        period: 14, 
        signalPeriod: 3,
        high: ohlcData.map(d => d.high), 
        low: ohlcData.map(d => d.low), 
        close: ohlcData.map(d => d.close) 
      };
      
      const ourStochTime = benchmark('Our Stochastic', () => stochastic(stochConfig));
      const refStochTime = benchmark('Reference Stochastic', () => refStochastic(stochConfig));
      
      const stochSpeedup = (refStochTime / ourStochTime).toFixed(2);
      console.log(`⚡ Speedup: ${stochSpeedup}x`);
    }
    
    // Bollinger Bands Benchmark
    if (size >= 20) {
      console.log('\n📈 Bollinger Bands (20,2)');
      const bbConfig = { period: 20, stdDev: 2, values: testData };
      
      const ourBBTime = benchmark('Our Bollinger Bands', () => bollingerbands(bbConfig));
      const refBBTime = benchmark('Reference Bollinger Bands', () => refBollingerBands(bbConfig));
      
      const bbSpeedup = (refBBTime / ourBBTime).toFixed(2);
      console.log(`⚡ Speedup: ${bbSpeedup}x`);
    }
    
    // ATR Benchmark
    if (size >= 14) {
      console.log('\n📈 ATR (period: 14)');
      const atrConfig = { 
        period: 14, 
        high: ohlcData.map(d => d.high), 
        low: ohlcData.map(d => d.low), 
        close: ohlcData.map(d => d.close) 
      };
      
      const ourATRTime = benchmark('Our ATR', () => atr(atrConfig));
      const refATRTime = benchmark('Reference ATR', () => refATR(atrConfig));
      
      const atrSpeedup = (refATRTime / ourATRTime).toFixed(2);
      console.log(`⚡ Speedup: ${atrSpeedup}x`);
    }
    
    // OBV Benchmark
    console.log('\n📈 OBV');
    const obvConfig = { close: ohlcData.map(d => d.close), volume: ohlcData.map(d => d.volume) };
    
    const ourOBVTime = benchmark('Our OBV', () => obv(obvConfig));
    const refOBVTime = benchmark('Reference OBV', () => refOBV(obvConfig));
    
    const obvSpeedup = (refOBVTime / ourOBVTime).toFixed(2);
    console.log(`⚡ Speedup: ${obvSpeedup}x`);
    
    // Williams %R Benchmark (skip reference if not available)
    if (size >= 14) {
      console.log('\n📈 Williams %R (period: 14)');
      const williamsConfig = { 
        period: 14, 
        high: ohlcData.map(d => d.high), 
        low: ohlcData.map(d => d.low), 
        close: ohlcData.map(d => d.close) 
      };
      
      const ourWilliamsTime = benchmark('Our Williams %R', () => williamsr(williamsConfig));
      
      if (typeof refWilliamsR === 'function') {
        const refWilliamsTime = benchmark('Reference Williams %R', () => refWilliamsR(williamsConfig));
        const williamsSpeedup = (refWilliamsTime / ourWilliamsTime).toFixed(2);
        console.log(`⚡ Speedup: ${williamsSpeedup}x`);
      } else {
        console.log('⚡ Reference implementation not available');
      }
    }
    
    console.log('\n' + '='.repeat(70));
  });
  
  console.log('\n✅ Benchmark Complete!');
  console.log('\n💡 Key Advantages:');
  console.log('   • Zero dependencies');
  console.log('   • Self-sufficient methods');
  console.log('   • High performance implementation');
  console.log('   • 100% compatible API with technicalindicators');
  console.log('   • Both functional and class-based APIs');
  console.log('   • Streaming support with nextValue()');
}

if (require.main === module) {
  runBenchmarks();
}

module.exports = { runBenchmarks, generateTestData, benchmark };