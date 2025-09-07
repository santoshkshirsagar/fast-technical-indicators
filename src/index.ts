// Types
export * from './types';

// Moving Averages
export { sma, SMA } from './moving-averages/sma';
export { ema, EMA } from './moving-averages/ema';
export { wma, WMA } from './moving-averages/wma';
export { wema, WEMA } from './moving-averages/wema';
export { macd, MACD } from './moving-averages/macd';

// Oscillators
export { rsi, RSI } from './oscillators/rsi';
export { cci, CCI } from './oscillators/cci';
export { awesomeoscillator, AwesomeOscillator } from './oscillators/awesome-oscillator';

// Momentum
export { roc, ROC } from './momentum/roc';
export { stochastic, Stochastic } from './momentum/stochastic';
export { williamsr, WilliamsR } from './momentum/williams-r';
export { trix, TRIX } from './momentum/trix';
export { stochasticrsi, StochasticRSI } from './momentum/stochastic-rsi';
export { psar, PSAR } from './momentum/psar';
export { kst, KST } from './momentum/kst';
export { ultimateoscillator, UltimateOscillator } from './momentum/ultimate-oscillator';
export { dpo, DPO } from './momentum/dpo';
export { priceoscillator, PriceOscillator } from './momentum/price-oscillator';
export { ppo, PPO } from './momentum/ppo';

// Volume
export { obv, OBV } from './volume/obv';
export { adl, ADL } from './volume/adl';
export { vwap, VWAP } from './volume/vwap';
export { forceindex, ForceIndex } from './volume/force-index';
export { mfi, MFI } from './volume/mfi';
export { volumeprofile, VolumeProfile } from './volume/volume-profile';

// Volatility
export { bollingerbands, BollingerBands } from './volatility/bollinger-bands';
export { atr, ATR } from './volatility/atr';
export { keltnerchannel, KeltnerChannels } from './volatility/keltner-channels';
export { chandelierexit, ChandelierExit } from './volatility/chandelier-exit';
export { donchianchannels, DonchianChannels } from './volatility/donchian-channels';
export { volatilityindex, VolatilityIndex } from './volatility/volatility-index';

// Directional Movement
export { truerange, TrueRange } from './directional-movement/true-range';
export { adx, ADX } from './directional-movement/adx';
export { plusdm, PlusDM } from './directional-movement/plus-dm';
export { minusdm, MinusDM } from './directional-movement/minus-dm';

// Trend
export { ichimokukinkouhyou, IchimokuKinkouhyou, IchimokuCloud } from './trend/ichimoku';
export { supertrend, SuperTrend } from './trend/supertrend';
export { aroon, Aroon } from './trend/aroon';
export { aroonoscillator, AroonOscillator } from './trend/aroon-oscillator';
export { linearregression, LinearRegression } from './trend/linear-regression';
export { maenvelope, MAEnvelope } from './trend/ma-envelope';
export { pivotpoints, PivotPoints } from './trend/pivot-points';

// Candlestick Patterns
export { doji, DojiPattern } from './candlestick/doji';
export { 
  bullishengulfingpattern, 
  bearishengulfingpattern,
  BullishEngulfingPattern,
  BearishEngulfingPattern 
} from './candlestick/engulfing';
export { hammer, HammerPattern } from './candlestick/hammer';
export { hangingman, HangingManPattern } from './candlestick/hanging-man';
export { shootingstar, ShootingStarPattern } from './candlestick/shooting-star';
export { spinningtop, SpinningTopPattern } from './candlestick/spinning-top';
export { marubozu, MarubozuPattern } from './candlestick/marubozu';
export { dragonflydoji, DragonflyDojiPattern } from './candlestick/dragonfly-doji';
export { gravestonedoji, GravestoneDojiPattern } from './candlestick/gravestone-doji';
export { threewhitesoldiers, ThreeWhiteSoldiersPattern } from './candlestick/three-white-soldiers';
export { threeblackcrows, ThreeBlackCrowsPattern } from './candlestick/three-black-crows';
export { bullishharami, BullishHarami } from './candlestick/bullish-harami';
export { bearishharami, BearishHarami } from './candlestick/bearish-harami';
export { piercingline, PiercingLine } from './candlestick/piercing-line';
export { darkcloudcover, DarkCloudCover } from './candlestick/dark-cloud-cover';
export { morningstar, MorningStar } from './candlestick/morning-star';
export { eveningstar, EveningStar } from './candlestick/evening-star';
export { tweezerbottom, TweezerBottom } from './candlestick/tweezer-bottom';
export { tweezertop, TweezerTop } from './candlestick/tweezer-top';
export { abandonedbaby, AbandonedBaby } from './candlestick/abandoned-baby';
export { bullishmarubozu, BullishMarubozu } from './candlestick/bullish-marubozu';
export { bearishmarubozu, BearishMarubozu } from './candlestick/bearish-marubozu';
export { bullishinvertedhammer, BullishInvertedHammer } from './candlestick/bullish-inverted-hammer';
export { bearishinvertedhammer, BearishInvertedHammer } from './candlestick/bearish-inverted-hammer';
export { bullishinvertedhammerstick, BullishInvertedHammerStick } from './candlestick/bullish-inverted-hammer-stick';
export { bearishinvertedhammerstick, BearishInvertedHammerStick } from './candlestick/bearish-inverted-hammer-stick';
export { morningdojistar, MorningDojiStar } from './candlestick/morning-doji-star';
export { eveningdojistar, EveningDojiStar } from './candlestick/evening-doji-star';
export { downsidetasukigap, DownsideTasukiGap } from './candlestick/downside-tasuki-gap';
export { bullishspinningtop, BullishSpinningTop } from './candlestick/bullish-spinning-top';
export { bearishspinningtop, BearishSpinningTop } from './candlestick/bearish-spinning-top';
export { bullish, Bullish } from './candlestick/bullish';
export { bearish, Bearish } from './candlestick/bearish';
export { bullishharamicross, BullishHaramiCross } from './candlestick/bullish-harami-cross';
export { bearishharamicross, BearishHaramiCross } from './candlestick/bearish-harami-cross';
export { hammerpatternunconfirmed, HammerPatternUnconfirmed } from './candlestick/hammer-pattern-unconfirmed';
export { hangingmanunconfirmed, HangingManUnconfirmed } from './candlestick/hanging-man-unconfirmed';
export { shootingstarunconfirmed, ShootingStarUnconfirmed } from './candlestick/shooting-star-unconfirmed';
export { bullishhammerstick, BullishHammerStick } from './candlestick/bullish-hammer-stick';
export { bearishhammerstick, BearishHammerStick } from './candlestick/bearish-hammer-stick';

// Utils
export {
  highest, Highest,
  lowest, Lowest,
  sd,
  sum,
  averageGain,
  averageLoss,
  crossUp,
  crossDown
} from './utils/index';
export { wildersmoothing, WilderSmoothing } from './utils/wilder-smoothing';
export { NumberFormatter, formatNumber, formatNumbers } from './utils/number-formatter';

// Missing Utility Classes
export { AverageGain, AverageLoss, SD } from './utils/missing-classes';

// Data Structures  
export {
  FixedSizeLinkedList,
  CandleList,
  Sum,
  CrossUp,
  CrossDown
} from './utils/data-structures';

// Chart Types
export { heikinashi, HeikinAshi } from './chart-types/heikin-ashi';
export { renko, Renko } from './chart-types/renko';
export { typicalprice, TypicalPrice } from './chart-types/typical-price';

// Drawing Tools
export { fibonacci, fibonacciExtensions, fibonacciProjection, Fibonacci } from './drawing-tools/fibonacci';

// StockData Helper
export { StockData } from './stock-data';

// Configuration
export { setConfig, getConfig, getPrecision, getEpsilon, formatValue, isEqual } from './config';

// Available Indicators utility
export { getAvailableIndicators, AvailableIndicators } from './utils/available-indicators';

// Backward compatibility exports
export { CandleData } from './types';

// Functional aliases for backward compatibility
export { averageGain as averagegain } from './utils/index';
export { averageLoss as averageloss } from './utils/index';

// API compatibility aliases for technicalindicators package
export { keltnerchannel as keltnerchannels } from './volatility/keltner-channels';
export { ichimokukinkouhyou as ichimokucloud } from './trend/ichimoku';
export { fibonacci as fibonacciretracement } from './drawing-tools/fibonacci';