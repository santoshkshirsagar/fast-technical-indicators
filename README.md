# Fast Technical Indicators

[![npm version](https://badge.fury.io/js/fast-technical-indicators.svg)](https://badge.fury.io/js/fast-technical-indicators)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

A high-performance, zero-dependency technical indicators library for JavaScript and TypeScript. **100% API-compatible** with the popular `technicalindicators` package, but with significant performance improvements and no external dependencies.

This library powers the [Algoticker](https://algoticker.com) no-code algorithmic trading platform, but can be used independently in any JavaScript/Node.js project.

## 🚀 Why Fast Technical Indicators?

- **🔥 High Performance**: Optimized algorithms with minimal overhead
- **📦 Zero Dependencies**: No external packages required
- **🔄 100% Compatible**: Drop-in replacement for `technicalindicators`
- **🎯 Self-Sufficient**: Each indicator method is completely independent
- **📊 Streaming Support**: Real-time data processing with `nextValue()`
- **🛡️ Type Safe**: Full TypeScript support with comprehensive type definitions
- **✅ Well Tested**: Extensive test suite comparing against reference implementation

## 📈 Performance

Benchmarks show significant performance improvements over the original `technicalindicators` package:

| Indicator | Performance Improvement |
|-----------|------------------------|
| **SMA** | 3.6x - 9.6x faster |
| **EMA** | 2.5x - 8.8x faster |
| **RSI** | 6.4x - 8.6x faster |
| **MACD** | 4.9x - 7.9x faster |
| **WMA** | 5.1x - 7.1x faster |
| **CCI** | 3.1x - 6.4x faster |
| **Stochastic** | 1.3x - 1.8x faster |
| **Bollinger Bands** | 1.4x - 6.3x faster |
| **ATR** | 2.3x - 6.3x faster |
| **OBV** | 1.0x - 5.9x faster |

*Performance improvements scale with dataset size. Larger datasets show more dramatic speedups.*

Run benchmarks yourself: `npm run benchmark`

## 🛠️ Installation

```bash
npm install fast-technical-indicators
```

## 📚 Usage

### Basic Usage (Functional API)

```typescript
import { sma, ema, rsi, macd, bollingerbands } from 'fast-technical-indicators';

const prices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Simple Moving Average
const smaResult = sma({ period: 4, values: prices });
console.log(smaResult); // [2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5]

// Exponential Moving Average
const emaResult = ema({ period: 4, values: prices });

// Relative Strength Index
const rsiResult = rsi({ period: 14, values: prices });

// MACD
const macdResult = macd({ 
  values: prices, 
  fastPeriod: 12, 
  slowPeriod: 26, 
  signalPeriod: 9 
});

// Bollinger Bands
const bbResult = bollingerbands({ 
  period: 20, 
  values: prices, 
  stdDev: 2 
});
```

### Class-Based API (Streaming)

Perfect for real-time data processing:

```typescript
import { SMA, EMA, RSI, MACD } from 'fast-technical-indicators';

// Initialize indicators
const smaIndicator = new SMA({ period: 20, values: [] });
const rsiIndicator = new RSI({ period: 14, values: [] });

// Process data point by point
const prices = [100, 101, 99, 102, 98, 103];

prices.forEach(price => {
  const smaValue = smaIndicator.nextValue(price);
  const rsiValue = rsiIndicator.nextValue(price);
  
  if (smaValue !== undefined) {
    console.log(`SMA: ${smaValue}`);
  }
  
  if (rsiValue !== undefined) {
    console.log(`RSI: ${rsiValue}`);
  }
});
```

## 🔧 Available Indicators

### Moving Averages
- **SMA** - Simple Moving Average
- **EMA** - Exponential Moving Average
- **WMA** - Weighted Moving Average
- **WEMA** - Wilder's Exponential Moving Average
- **MACD** - Moving Average Convergence Divergence

### Oscillators
- **RSI** - Relative Strength Index
- **CCI** - Commodity Channel Index

### Momentum Indicators
- **ROC** - Rate of Change
- **Stochastic** - Stochastic Oscillator (%K, %D)
- **Williams %R** - Williams Percent Range
- **TRIX** - Triple Exponential Moving Average
- **Ultimate Oscillator** - Multiple timeframe momentum oscillator
- **DPO** - Detrended Price Oscillator (removes trend component)
- **Price Oscillator** - Difference between fast and slow moving averages
- **PPO** - Percentage Price Oscillator (MACD in percentage terms)

### Volume Indicators
- **OBV** - On-Balance Volume
- **ADL** - Accumulation/Distribution Line
- **VWAP** - Volume Weighted Average Price

### Volatility Indicators
- **Bollinger Bands** - Bollinger Bands with %B and Width
- **ATR** - Average True Range
- **Donchian Channels** - Highest high and lowest low channels with middle line
- **Volatility Index** - Statistical measure of price volatility

### Directional Movement
- **True Range** - True Range calculation

### Trend Indicators
- **SuperTrend** - Trend-following indicator using ATR
- **Aroon Indicator** - Measures time since highest high and lowest low
- **Aroon Oscillator** - Difference between Aroon Up and Aroon Down
- **Linear Regression** - Statistical trend analysis with slope, intercept and forecast
- **Moving Average Envelope** - Moving average with percentage-based upper and lower bands
- **Pivot Points** - Support and resistance levels (Standard, Fibonacci, Camarilla, Woodie)

### Candlestick Patterns
- **Doji** - Doji pattern detection
- **Bullish/Bearish Engulfing** - Engulfing pattern detection

### Utilities
- **Highest** - Highest value over period
- **Lowest** - Lowest value over period
- **Standard Deviation** - Statistical standard deviation
- **Sum** - Sum over period
- **Average Gain** - Average of positive changes
- **Average Loss** - Average of negative changes
- **Cross Up/Down** - Detect line crossovers

## 📊 API Reference

### Simple Moving Average (SMA)

```typescript
// Functional
sma({ period: 20, values: number[] }) => number[]

// Class-based  
new SMA({ period: 20, values?: number[] })
smaInstance.nextValue(price: number) => number | undefined
```

### Exponential Moving Average (EMA)

```typescript
// Functional
ema({ period: 20, values: number[] }) => number[]

// Class-based
new EMA({ period: 20, values?: number[] })
emaInstance.nextValue(price: number) => number | undefined
```

### Relative Strength Index (RSI)

```typescript
// Functional
rsi({ period: 14, values: number[] }) => number[]

// Class-based
new RSI({ period: 14, values?: number[] })
rsiInstance.nextValue(price: number) => number | undefined
```

### MACD

```typescript
interface MACDInput {
  values: number[];
  fastPeriod?: number;    // default: 12
  slowPeriod?: number;    // default: 26
  signalPeriod?: number;  // default: 9
  SimpleMAOscillator?: boolean; // default: false
  SimpleMASignal?: boolean;     // default: false
}

interface MACDOutput {
  MACD?: number;
  signal?: number;
  histogram?: number;
}

// Functional
macd(input: MACDInput) => MACDOutput[]

// Class-based
new MACD(input: MACDInput)
macdInstance.nextValue(price: number) => MACDOutput | undefined
```

### Bollinger Bands

```typescript
interface BollingerBandsInput {
  period?: number;    // default: 20
  values: number[];
  stdDev?: number;    // default: 2
}

interface BollingerBandsOutput {
  upper?: number;
  middle?: number;
  lower?: number;
  pb?: number;      // %B
  width?: number;   // Band width
}

// Functional
bollingerbands(input: BollingerBandsInput) => BollingerBandsOutput[]

// Class-based
new BollingerBands(input: BollingerBandsInput)
bbInstance.nextValue(price: number) => BollingerBandsOutput | undefined
```

## 🔄 Migration from technicalindicators

This library is a **drop-in replacement**. Simply change your import:

```typescript
// Before
import { sma, ema, rsi, macd } from 'technicalindicators';

// After  
import { sma, ema, rsi, macd } from 'fast-technical-indicators';

// Everything else stays the same!
```

## 🧪 Testing

The library includes comprehensive tests comparing results with the original `technicalindicators` package:

```bash
npm test           # Run tests
npm run test:watch # Watch mode
npm run test:coverage # Coverage report
```

## 📊 Benchmarks

Run performance comparisons:

```bash
npm run benchmark
```

## 🤝 Contributing

Contributions are welcome! Please ensure:

1. All indicators remain **zero dependency**
2. Methods are **self-sufficient** (no internal function calls between indicators)
3. API remains **100% compatible** with `technicalindicators`
4. New indicators include comprehensive **tests** and **benchmarks**

## 📄 License

MIT - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

This library maintains API compatibility with the excellent [technicalindicators](https://github.com/anandanand84/technicalindicators) package by @anandanand84. We've reimplemented the algorithms for better performance while keeping the familiar interface.

---

**Made with ❤️ for the trading community**

*Build faster, trade smarter* 🚀