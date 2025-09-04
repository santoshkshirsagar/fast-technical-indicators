/**
 * Available Indicators utility for API compatibility with technicalindicators package
 */

export function getAvailableIndicators(): string[] {
  return [
    // Moving Averages
    'sma', 'ema', 'wma', 'wema', 'macd',
    
    // Oscillators  
    'rsi', 'cci', 'awesomeoscillator',
    
    // Momentum
    'roc', 'stochastic', 'williamsr', 'trix', 'stochasticrsi', 'psar', 'kst',
    'ultimateoscillator', 'dpo', 'priceoscillator', 'ppo',
    
    // Volume
    'obv', 'adl', 'vwap', 'forceindex', 'mfi', 'volumeprofile',
    
    // Volatility
    'bollingerbands', 'atr', 'keltnerchannels', 'chandelierexit', 
    'donchianchannels', 'volatilityindex',
    
    // Directional Movement
    'truerange', 'adx', 'plusdm', 'minusdm',
    
    // Trend
    'ichimokucloud', 'supertrend', 'aroon', 'aroonoscillator',
    'linearregression', 'maenvelope', 'pivotpoints',
    
    // Candlestick Patterns
    'doji', 'bullishengulfingpattern', 'bearishengulfingpattern',
    'hammer', 'hangingman', 'shootingstar', 'spinningtop', 'marubozu',
    'dragonflydoji', 'gravestonedoji', 'threewhitesoldiers', 'threeblackcrows',
    'bullishharami', 'bearishharami', 'piercingline', 'darkcloudcover',
    'morningstar', 'eveningstar', 'tweezerbottom', 'tweezertop',
    'abandonedbaby', 'bullishmarubozu', 'bearishmarubozu',
    'bullishinvertedhammer', 'bearishinvertedhammer', 'morningdojistar',
    'eveningdojistar', 'downsidetasukigap', 'bullishspinningtop',
    'bearishspinningtop', 'bullish', 'bearish', 'bullishharamicross',
    'bearishharamicross', 'hammerpatternunconfirmed', 'hangingmanunconfirmed',
    'shootingstarunconfirmed', 'bullishhammerstick', 'bearishhammerstick',
    
    // Chart Types
    'heikinashi', 'renko', 'typicalprice',
    
    // Drawing Tools
    'fibonacciretracement', 'fibonacci', 'fibonacciExtensions', 'fibonacciProjection',
    
    // Utils
    'highest', 'lowest', 'sum', 'averagegain', 'averageloss', 
    'crossup', 'crossdown', 'sd'
  ];
}

// Alternative function name for compatibility
export const AvailableIndicators = {
  getAll: getAvailableIndicators
};