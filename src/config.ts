interface Config {
  precision?: number;
  epsilon?: number;
  [key: string]: any;
}

let globalConfig: Config = {
  precision: 2,
  epsilon: 0.0001
};

export function setConfig(config: Partial<Config>): void {
  globalConfig = { ...globalConfig, ...config };
}

export function getConfig(): Config {
  return { ...globalConfig };
}

// Helper function to get specific config values
export function getPrecision(): number {
  return globalConfig.precision || 2;
}

export function getEpsilon(): number {
  return globalConfig.epsilon || 0.0001;
}

// Helper function to format numbers based on precision
export function formatValue(value: number): number {
  const precision = getPrecision();
  return parseFloat(value.toFixed(precision));
}

// Helper function to check if two values are approximately equal
export function isEqual(a: number, b: number): boolean {
  return Math.abs(a - b) < getEpsilon();
}