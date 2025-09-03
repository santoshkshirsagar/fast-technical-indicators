# Missing Technical Indicators

This document tracks technical indicators that need to be implemented to make this package more comprehensive. As indicators are implemented, they should be removed from this list.

## High Priority Indicators

### Trend Indicators
- [x] ~~**SuperTrend** - ⭐ **IMPLEMENTED** - Popular trend-following indicator using ATR~~
- [x] ~~**Aroon Indicator** - ⭐ **IMPLEMENTED** - Measures time since highest high and lowest low~~
- [x] ~~**Aroon Oscillator** - ⭐ **IMPLEMENTED** - Difference between Aroon Up and Aroon Down~~
- [x] ~~**Linear Regression** - ⭐ **IMPLEMENTED** - Statistical trend analysis~~
- [x] ~~**Moving Average Envelope** - ⭐ **IMPLEMENTED** - Moving average with percentage bands~~
- [x] ~~**Pivot Points** - ⭐ **IMPLEMENTED** - Support and resistance levels~~

### Momentum Indicators
- [x] ~~**Ultimate Oscillator (UO)** - ⭐ **IMPLEMENTED** - Multiple timeframe momentum~~
- [x] ~~**Detrended Price Oscillator (DPO)** - ⭐ **IMPLEMENTED** - Price oscillator removing trend~~
- [x] ~~**Price Oscillator** - ⭐ **IMPLEMENTED** - Difference between two moving averages~~
- [x] ~~**Percentage Price Oscillator (PPO)** - ⭐ **IMPLEMENTED** - MACD in percentage terms~~

### Volatility Indicators
- [x] ~~**Donchian Channels** - ⭐ **IMPLEMENTED** - Highest high and lowest low channels~~
- [x] ~~**Volatility Index** - ⭐ **IMPLEMENTED** - Measure of price volatility~~

### Volume Indicators
- [ ] **Price Volume Trend (PVT)** - Cumulative volume-price momentum
- [ ] **Negative Volume Index (NVI)** - Volume analysis for down days
- [ ] **Positive Volume Index (PVI)** - Volume analysis for up days
- [ ] **Ease of Movement (EOM)** - Volume-weighted price momentum
- [ ] **Chaikin Money Flow (CMF)** - Volume-weighted average of accumulation/distribution

### Oscillators
- [ ] **Fisher Transform** - Price transformation for clearer signals
- [ ] **Balance of Power** - Strength of buyers vs sellers
- [ ] **Elder Ray Index** - Bull Power and Bear Power

## Medium Priority Indicators

### Trend Indicators
- [ ] **Time Series Forecast** - Statistical price forecasting
- [ ] **Parabolic Time/Price System** - Alternative PSAR implementation
- [ ] **Zig Zag** - Price reversal indicator
- [ ] **Linear Regression Slope** - Trend direction measurement
- [ ] **Standard Error** - Linear regression accuracy
- [ ] **R-Squared** - Linear regression correlation

### Momentum Indicators
- [ ] **Coppock Curve** - Long-term momentum indicator
- [ ] **Chande Momentum Oscillator** - Alternative RSI calculation
- [ ] **Inertia Indicator** - RVI-based momentum
- [ ] **Klinger Oscillator** - Volume-based momentum
- [ ] **Prime Number Oscillator** - Mathematical price analysis
- [ ] **Prime Number Bands** - Support/resistance based on prime numbers
- [ ] **Psychological Line** - Percentage of up days

### Volatility Indicators
- [ ] **Mass Index** - Volatility reversal indicator
- [ ] **Chaikin Volatility** - Rate of change of true range
- [ ] **Volatility System** - Welles Wilder volatility method
- [ ] **Historical Volatility** - Statistical price volatility

### Volume Indicators
- [ ] **Volume Rate of Change** - Volume momentum
- [ ] **Two Pole Butterworth Filter** - Advanced volume smoothing
- [ ] **Three Pole Butterworth Filter** - Advanced volume smoothing
- [ ] **Chaikin Oscillator** - ADL momentum

## Low Priority Indicators

### Cycle Indicators
- [ ] **Mesa Adaptive Moving Average** - Adaptive trend following
- [ ] **Hilbert Transform** - Cycle analysis
- [ ] **Sine Wave** - Cycle-based price prediction
- [ ] **Lead Sine** - Leading cycle indicator

### Mathematical Transforms
- [ ] **Correlation Coefficient** - Price correlation analysis
- [ ] **Beta** - Market correlation measurement
- [ ] **Linear Regression Intercept** - Y-axis intercept
- [ ] **Standard Error of Estimate** - Regression accuracy
- [ ] **Time Series Moving Average** - Advanced MA calculation

### Specialized Indicators
- [ ] **Market Facilitation Index** - Volume efficiency
- [ ] **Schiff Pitchfork** - Geometric price channels
- [ ] **Gann Square** - Gann analysis tools
- [ ] **Elliott Wave** - Wave pattern recognition
- [ ] **Fibonacci Time Zones** - Time-based Fibonacci analysis

## Implementation Notes

When implementing new indicators, follow the existing project structure:

1. **File Structure**: Create files in appropriate category folders (trend/, momentum/, volatility/, etc.)
2. **Dual API**: Implement both functional and class-based streaming versions
3. **TypeScript**: Include comprehensive type definitions
4. **Testing**: Add tests comparing against reference implementations
5. **Export**: Add exports to main index.ts file
6. **Documentation**: Include JSDoc comments with parameter descriptions

### Example Structure:
```typescript
// Functional version
export function indicatorName(data: InputData, params: Parameters): OutputData

// Class version for streaming
export class IndicatorName {
  constructor(params: Parameters)
  nextValue(value: InputValue): OutputValue | undefined
  getResult(): OutputData
}
```

### Parameter Naming Convention:
- `period` - Number of periods for calculation
- `values` - Input price array
- `high`, `low`, `close`, `volume` - OHLCV data
- `multiplier` - Multiplication factor
- `signal` - Signal line period