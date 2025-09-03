# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-01-16

### Added
- 🚀 Initial release of fast-technical-indicators
- 📈 Core technical indicators implemented:
  - Simple Moving Average (SMA)
  - Exponential Moving Average (EMA)
  - Relative Strength Index (RSI)
  - MACD (Moving Average Convergence Divergence)
  - Bollinger Bands
- 🛠️ Utility functions:
  - Highest/Lowest values over period
  - Standard deviation
  - Sum over period
  - Average gain/loss
  - Cross up/down detection
- 🔄 Dual API support:
  - Functional API for batch processing
  - Class-based API for streaming/real-time data
- ⚡ Performance optimizations:
  - 4-8x faster than technicalindicators package
  - Zero external dependencies
  - Self-sufficient methods
- 🛡️ TypeScript support with comprehensive type definitions
- ✅ 100% API compatibility with technicalindicators package
- 🧪 Comprehensive test suite comparing against reference implementation
- 📊 Performance benchmarking tools

### Performance Improvements
- SMA: 4-8x faster
- EMA: 3-8x faster
- RSI: 6-8x faster
- MACD: 4-7x faster

### Technical Details
- Zero dependencies
- Self-sufficient indicator methods
- Both CommonJS and ESM builds
- Full TypeScript support
- Streaming capabilities with `nextValue()` method
- Memory efficient implementations