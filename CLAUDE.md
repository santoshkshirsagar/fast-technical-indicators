# Claude Code Configuration

## Project Overview
This is a high-performance technical indicators library built as a zero-dependency replacement for the `technicalindicators` npm package. It provides 4-8x better performance while maintaining 100% API compatibility.

## Build Commands
- `npm run build:lib` - Build the TypeScript library
- `npm run test` - Run the test suite
- `npm run lint` - Run linting (if configured)
- `npm run typecheck` - Run TypeScript type checking (if configured)

## Project Structure
```
src/
├── types/                  # Type definitions
├── moving-averages/        # SMA, EMA, WMA, WEMA, MACD
├── oscillators/           # RSI, CCI, Awesome Oscillator
├── momentum/              # ROC, Stochastic, Williams %R, TRIX, Stochastic RSI, PSAR, KST
├── volume/                # OBV, ADL, VWAP, Force Index, MFI, Volume Profile
├── volatility/            # Bollinger Bands, ATR, Keltner Channels, Chandelier Exit
├── directional-movement/  # True Range, ADX
├── trend/                 # Ichimoku Cloud
├── candlestick/           # Doji, Engulfing, Hammer, Shooting Star, etc.
├── chart-types/           # Heikin Ashi, Renko
└── utils/                 # Utility functions and data structures
```

## Key Features
- **Zero Dependencies**: All algorithms are self-contained
- **Dual API**: Both functional and class-based streaming implementations
- **TypeScript Support**: Comprehensive type definitions
- **Performance Optimized**: 4-8x faster than original package
- **API Compatible**: Same parameter structure as technicalindicators package

## Development Notes
- All indicators follow the pattern: functional version + class-based streaming version
- Self-sufficient methods (no cross-dependencies between indicators)
- Comprehensive test coverage comparing against reference implementation
- Built for production trading systems requiring high performance

## Testing
The project includes comprehensive tests comparing results against the original `technicalindicators` package to ensure accuracy and compatibility.

## API Compatibility
This package can serve as a drop-in replacement for the original `technicalindicators` package in production systems, providing the same method names and parameter structures while delivering significantly better performance.

## Adding New Indicators

When implementing new indicators, follow these steps:

1. **Create Implementation File**: Add the indicator file in the appropriate category folder (trend/, momentum/, volatility/, etc.)
2. **Follow Dual API Pattern**: Implement both functional and class-based streaming versions
3. **Add to indicators.json**: Add the indicator configuration with inputs, defaults, and outputs
4. **Update README.md**: Add the new indicator to the available indicators list
5. **Add to index.ts**: Export the new indicator functions and classes
6. **Write Tests**: Include comprehensive tests comparing against reference implementations
7. **Update MISSINGINDICATORS.md**: Remove the implemented indicator from the missing list

### Example Structure:
```typescript
// Functional version
export function indicatorName(input: InputInterface): OutputType[]

// Class version for streaming
export class IndicatorName {
  constructor(input: InputInterface)
  nextValue(value: InputValue): OutputType | undefined
  getResult(): OutputType[]
}
```

### Required Files to Update:
- `/src/[category]/[indicator-name].ts` - Implementation
- `/src/index.ts` - Add exports
- `/indicators.json` - Add configuration
- `/README.md` - Add to available indicators list
- `/MISSINGINDICATORS.md` - Remove from missing list